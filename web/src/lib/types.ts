// Shared domain types for the Travel Kotagiri booking engine.

export type Homestay = {
  id: string;
  slug: string;
  name: string;
  type: string;
  area: string | null;
  description: string | null;
  price_text: string | null;
  base_price: number | null;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[] | null;
  rating: number | null;
  reviews_count: number | null;
  image_url: string | null;
  website_url: string | null;
  map_url: string | null;
  badges: string[] | null;
  host_phone: string | null;
  owner_id: string | null;
  is_featured: boolean;
  is_published: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type BookingStatus =
  | "requested"
  | "approved"
  | "declined"
  | "cancelled"
  | "completed";

export type Booking = {
  id: string;
  homestay_id: string;
  owner_id: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  notes: string | null;
  amount: number | null;
  status: BookingStatus;
  created_at: string;
};
