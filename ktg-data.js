/* =====================================================================
   travelkotagiri — Supabase data layer
   Loaded on every page. Uses the public (anon/publishable) key, which is
   safe to expose in the browser: Row Level Security on the database
   controls exactly what anonymous visitors can read and write.
   ===================================================================== */
const KTG = (() => {
  const SUPABASE_URL = "https://lewhmonjzoznnqxtdkcn.supabase.co";
  const SUPABASE_KEY = "sb_publishable_lQ_IUiEB92JIyN9CfPWVsg_6VajXsbK";
  const REST = SUPABASE_URL + "/rest/v1";
  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
  };

  // ---- reads ----
  async function getHomestays() {
    const r = await fetch(REST + "/homestays?is_published=eq.true&order=sort_order.asc", { headers });
    if (!r.ok) throw new Error("homestays " + r.status);
    return r.json();
  }
  async function getRestaurants() {
    const r = await fetch(REST + "/restaurants?is_published=eq.true&order=sort_order.asc", { headers });
    if (!r.ok) throw new Error("restaurants " + r.status);
    return r.json();
  }

  // ---- writes ----
  async function submitListing(payload) {
    const r = await fetch(REST + "/listing_submissions", {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("submitListing " + r.status + " " + (await r.text()));
    return true;
  }
  async function submitEnquiry(payload) {
    const r = await fetch(REST + "/enquiries", {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error("submitEnquiry " + r.status + " " + (await r.text()));
    return true;
  }

  return { getHomestays, getRestaurants, submitListing, submitEnquiry, SUPABASE_URL };
})();
