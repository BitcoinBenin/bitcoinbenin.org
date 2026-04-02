export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  registration_url: string;
  image?: string;
  video_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
