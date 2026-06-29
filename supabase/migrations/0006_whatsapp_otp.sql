-- WhatsApp OTP verification for partner profile + listing claims (Airbnb-style phone proof).

drop function if exists submit_listing_claim(text, uuid, text);

create type otp_purpose as enum ('profile', 'claim');

alter table profiles
  add column if not exists phone_verified_at timestamptz;

create table phone_otp_challenges (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  purpose         otp_purpose not null,
  phone           text not null,
  listing_type    listing_type,
  homestay_id     uuid references homestays(id) on delete cascade,
  restaurant_id   uuid references restaurants(id) on delete cascade,
  code_hash       text not null,
  attempts        int not null default 0,
  max_attempts    int not null default 5,
  expires_at      timestamptz not null,
  verified_at     timestamptz,
  consumed_at     timestamptz,
  created_at      timestamptz not null default now(),
  constraint otp_claim_target check (
    purpose = 'profile'
    or (
      listing_type is not null
      and (
        (listing_type = 'homestay' and homestay_id is not null and restaurant_id is null)
        or (listing_type = 'restaurant' and restaurant_id is not null and homestay_id is null)
      )
    )
  )
);

create index phone_otp_user_idx on phone_otp_challenges(user_id, purpose, created_at desc);
create index phone_otp_phone_idx on phone_otp_challenges(phone, created_at desc);

alter table phone_otp_challenges enable row level security;

create policy otp_owner_read on phone_otp_challenges
  for select using (user_id = auth.uid() or is_admin());

alter table listing_claim_requests
  add column if not exists otp_verified boolean not null default false;

-- Updated claim flow: requires a verified WhatsApp OTP challenge for this listing.
create or replace function submit_listing_claim(
  p_listing_type text,
  p_listing_id uuid,
  p_verification_phone text,
  p_otp_challenge_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile profiles%rowtype;
  v_host_phone text;
  v_listing_name text;
  v_profile_phone text;
  v_otp_ok boolean;
begin
  if v_user_id is null then
    return jsonb_build_object('status', 'error', 'message', 'Not signed in');
  end if;

  if p_otp_challenge_id is null then
    return jsonb_build_object('status', 'error', 'message', 'WhatsApp verification required');
  end if;

  select exists (
    select 1 from phone_otp_challenges c
    where c.id = p_otp_challenge_id
      and c.user_id = v_user_id
      and c.purpose = 'claim'
      and c.verified_at is not null
      and c.consumed_at is null
      and c.verified_at > now() - interval '15 minutes'
      and phones_match(c.phone, p_verification_phone)
      and c.listing_type = p_listing_type::listing_type
      and (
        (p_listing_type = 'homestay' and c.homestay_id = p_listing_id)
        or (p_listing_type = 'restaurant' and c.restaurant_id = p_listing_id)
      )
  ) into v_otp_ok;

  if not v_otp_ok then
    return jsonb_build_object(
      'status', 'error',
      'message', 'WhatsApp code expired or invalid. Request a new code and try again.'
    );
  end if;

  if coalesce(trim(p_verification_phone), '') = '' then
    return jsonb_build_object('status', 'error', 'message', 'Enter the property WhatsApp number');
  end if;

  select * into v_profile from profiles where id = v_user_id;
  v_profile_phone := coalesce(v_profile.phone, v_profile.whatsapp, '');

  if v_profile.phone_verified_at is null then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Verify your partner profile phone first (step 1).'
    );
  end if;

  if not phones_match(p_verification_phone, v_profile_phone) then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Use the same WhatsApp number from your verified partner profile.'
    );
  end if;

  if p_listing_type = 'homestay' then
    select host_phone, name into v_host_phone, v_listing_name
    from homestays
    where id = p_listing_id and owner_id is null and is_published = true;
  elsif p_listing_type = 'restaurant' then
    select host_phone, name into v_host_phone, v_listing_name
    from restaurants
    where id = p_listing_id and owner_id is null and is_published = true;
  else
    return jsonb_build_object('status', 'error', 'message', 'Invalid listing type');
  end if;

  if v_listing_name is null then
    return jsonb_build_object('status', 'error', 'message', 'Listing not found or already claimed');
  end if;

  if exists (
    select 1 from listing_claim_requests
    where user_id = v_user_id and status = 'pending'
      and listing_type = p_listing_type::listing_type
      and (
        (p_listing_type = 'homestay' and homestay_id = p_listing_id)
        or (p_listing_type = 'restaurant' and restaurant_id = p_listing_id)
      )
  ) then
    return jsonb_build_object(
      'status', 'pending',
      'message', 'You already have a pending claim for this listing. We will contact you on WhatsApp.'
    );
  end if;

  if v_host_phone is null then
    insert into listing_claim_requests (
      user_id, listing_type, homestay_id, restaurant_id, verification_phone, status, otp_verified
    ) values (
      v_user_id,
      p_listing_type::listing_type,
      case when p_listing_type = 'homestay' then p_listing_id else null end,
      case when p_listing_type = 'restaurant' then p_listing_id else null end,
      digits_only(p_verification_phone),
      'pending',
      true
    );

    update phone_otp_challenges set consumed_at = now() where id = p_otp_challenge_id;

    return jsonb_build_object(
      'status', 'pending',
      'message', 'This listing has no phone on file. Our team will verify ownership manually within 1–2 business days.'
    );
  end if;

  if not phones_match(p_verification_phone, v_host_phone) then
    return jsonb_build_object(
      'status', 'error',
      'message', 'That number does not match our records for this property. Contact support if your number has changed.'
    );
  end if;

  if p_listing_type = 'homestay' then
    update homestays set owner_id = v_user_id
    where id = p_listing_id and owner_id is null;
  else
    update restaurants set owner_id = v_user_id
    where id = p_listing_id and owner_id is null;
  end if;

  if not found then
    return jsonb_build_object('status', 'error', 'message', 'Listing was just claimed by someone else');
  end if;

  insert into listing_claim_requests (
    user_id, listing_type, homestay_id, restaurant_id, verification_phone, status, reviewed_at, otp_verified
  ) values (
    v_user_id,
    p_listing_type::listing_type,
    case when p_listing_type = 'homestay' then p_listing_id else null end,
    case when p_listing_type = 'restaurant' then p_listing_id else null end,
    digits_only(p_verification_phone),
    'approved',
    now(),
    true
  );

  update phone_otp_challenges set consumed_at = now() where id = p_otp_challenge_id;

  return jsonb_build_object('status', 'approved', 'message', 'Listing linked to your account');
end;
$$;

-- Complete partner profile after profile-purpose OTP is verified.
create or replace function complete_verified_profile(
  p_otp_challenge_id uuid,
  p_full_name text,
  p_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    return jsonb_build_object('status', 'error', 'message', 'Not signed in');
  end if;

  if coalesce(trim(p_full_name), '') = '' then
    return jsonb_build_object('status', 'error', 'message', 'Enter your full name');
  end if;

  if not exists (
    select 1 from phone_otp_challenges c
    where c.id = p_otp_challenge_id
      and c.user_id = v_user_id
      and c.purpose = 'profile'
      and c.verified_at is not null
      and c.consumed_at is null
      and c.verified_at > now() - interval '15 minutes'
      and phones_match(c.phone, p_phone)
  ) then
    return jsonb_build_object(
      'status', 'error',
      'message', 'WhatsApp verification expired. Request a new code.'
    );
  end if;

  update profiles
  set
    full_name = trim(p_full_name),
    phone = digits_only(p_phone),
    whatsapp = digits_only(p_phone),
    phone_verified_at = now()
  where id = v_user_id;

  update phone_otp_challenges set consumed_at = now() where id = p_otp_challenge_id;

  return jsonb_build_object('status', 'ok', 'message', 'Profile verified');
end;
$$;

grant execute on function submit_listing_claim(text, uuid, text, uuid) to authenticated;
grant execute on function complete_verified_profile(uuid, text, text) to authenticated;

-- Partners who completed profile before OTP rollout keep access.
update profiles
set phone_verified_at = coalesce(phone_verified_at, now())
where phone_verified_at is null
  and coalesce(trim(full_name), '') <> ''
  and coalesce(nullif(trim(phone), ''), nullif(trim(whatsapp), ''), '') is not null;
