-- Let signed-in owners claim unowned curated listings by setting owner_id to themselves.
create policy homestays_owner_claim on homestays
  for update using (owner_id is null and auth.uid() is not null)
  with check (owner_id = auth.uid());

create policy restaurants_owner_claim on restaurants
  for update using (owner_id is null and auth.uid() is not null)
  with check (owner_id = auth.uid());
