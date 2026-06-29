-- Secure listing claims: remove open self-claim, verify host phone before linking.

drop policy if exists homestays_owner_claim on homestays;
drop policy if exists restaurants_owner_claim on restaurants;

create type listing_type as enum ('homestay', 'restaurant');
create type claim_status as enum ('pending', 'approved', 'rejected');

create table listing_claim_requests (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references profiles(id) on delete cascade,
  listing_type        listing_type not null,
  homestay_id         uuid references homestays(id) on delete cascade,
  restaurant_id       uuid references restaurants(id) on delete cascade,
  verification_phone  text not null,
  status              claim_status not null default 'pending',
  admin_notes         text,
  reviewed_at         timestamptz,
  reviewed_by         uuid references profiles(id),
  created_at          timestamptz not null default now(),
  constraint listing_claim_one_target check (
    (listing_type = 'homestay' and homestay_id is not null and restaurant_id is null)
    or (listing_type = 'restaurant' and restaurant_id is not null and homestay_id is null)
  )
);

create index listing_claim_requests_user_idx on listing_claim_requests(user_id);
create index listing_claim_requests_status_idx on listing_claim_requests(status);

alter table listing_claim_requests enable row level security;

create policy claim_requests_owner_read on listing_claim_requests
  for select using (user_id = auth.uid() or is_admin());

create policy claim_requests_owner_insert on listing_claim_requests
  for insert with check (user_id = auth.uid());

create policy claim_requests_admin_update on listing_claim_requests
  for update using (is_admin());

-- Compare phones by digits; match full string or last 10 digits (India).
create or replace function digits_only(t text)
returns text language sql immutable as $$
  select regexp_replace(coalesce(t, ''), '\D', '', 'g');
$$;

create or replace function phones_match(a text, b text)
returns boolean language sql immutable as $$
  select
    digits_only(a) <> ''
    and digits_only(b) <> ''
    and (
      digits_only(a) = digits_only(b)
      or (
        length(right(digits_only(a), 10)) = 10
        and right(digits_only(a), 10) = right(digits_only(b), 10)
      )
    );
$$;

-- Owner submits a claim; auto-approves only when verification phone matches
-- both the listing host_phone and the signed-in profile phone.
create or replace function submit_listing_claim(
  p_listing_type text,
  p_listing_id uuid,
  p_verification_phone text
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
begin
  if v_user_id is null then
    return jsonb_build_object('status', 'error', 'message', 'Not signed in');
  end if;

  if coalesce(trim(p_verification_phone), '') = '' then
    return jsonb_build_object('status', 'error', 'message', 'Enter the property WhatsApp number');
  end if;

  select * into v_profile from profiles where id = v_user_id;
  v_profile_phone := coalesce(v_profile.phone, v_profile.whatsapp, '');

  if not phones_match(p_verification_phone, v_profile_phone) then
    return jsonb_build_object(
      'status', 'error',
      'message', 'Use the same WhatsApp number from your partner profile. Update step 1 if needed.'
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
      user_id, listing_type, homestay_id, restaurant_id, verification_phone, status
    ) values (
      v_user_id,
      p_listing_type::listing_type,
      case when p_listing_type = 'homestay' then p_listing_id else null end,
      case when p_listing_type = 'restaurant' then p_listing_id else null end,
      digits_only(p_verification_phone),
      'pending'
    );

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
    user_id, listing_type, homestay_id, restaurant_id, verification_phone, status, reviewed_at
  ) values (
    v_user_id,
    p_listing_type::listing_type,
    case when p_listing_type = 'homestay' then p_listing_id else null end,
    case when p_listing_type = 'restaurant' then p_listing_id else null end,
    digits_only(p_verification_phone),
    'approved',
    now()
  );

  return jsonb_build_object('status', 'approved', 'message', 'Listing linked to your account');
end;
$$;

create or replace function review_listing_claim(
  p_claim_id uuid,
  p_action text,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_claim listing_claim_requests%rowtype;
begin
  if not is_admin() then
    return jsonb_build_object('status', 'error', 'message', 'Admin only');
  end if;

  select * into v_claim from listing_claim_requests where id = p_claim_id;
  if v_claim.id is null then
    return jsonb_build_object('status', 'error', 'message', 'Claim not found');
  end if;
  if v_claim.status <> 'pending' then
    return jsonb_build_object('status', 'error', 'message', 'Claim already reviewed');
  end if;

  if p_action = 'approve' then
    if v_claim.listing_type = 'homestay' then
      update homestays set owner_id = v_claim.user_id
      where id = v_claim.homestay_id and owner_id is null;
    else
      update restaurants set owner_id = v_claim.user_id
      where id = v_claim.restaurant_id and owner_id is null;
    end if;

    if not found then
      return jsonb_build_object('status', 'error', 'message', 'Listing already has an owner');
    end if;

    update listing_claim_requests
    set status = 'approved', reviewed_at = now(), reviewed_by = auth.uid(), admin_notes = p_notes
    where id = p_claim_id;

    return jsonb_build_object('status', 'approved', 'message', 'Claim approved');
  elsif p_action = 'reject' then
    update listing_claim_requests
    set status = 'rejected', reviewed_at = now(), reviewed_by = auth.uid(), admin_notes = p_notes
    where id = p_claim_id;

    return jsonb_build_object('status', 'rejected', 'message', 'Claim rejected');
  end if;

  return jsonb_build_object('status', 'error', 'message', 'Invalid action');
end;
$$;

grant execute on function submit_listing_claim(text, uuid, text) to authenticated;
grant execute on function review_listing_claim(uuid, text, text) to authenticated;
