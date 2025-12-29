// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  avatar: string | null;
  bio: string;
  role: 'user' | 'moderator' | 'admin';
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  github: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
  message: string;
}

// Forum Types
export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  color: string;
  order: number;
  posts_count: number;
  created_at: string;
}

export interface Post {
  id: number;
  category: Category;
  author: User;
  title: string;
  content: string;
  views: number;
  is_pinned: boolean;
  is_locked: boolean;
  replies_count: number;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reply {
  id: number;
  post: number;
  author: User;
  parent: number | null;
  content: string;
  likes_count: number;
  is_liked: boolean;
  children: Reply[];
  created_at: string;
  updated_at: string;
}

// Event Types
export interface EventSchedule {
  id: number;
  day: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  start_time: string;
  end_time: string;
  order: number;
}

export interface EventSpeaker {
  id: number;
  name: string;
  title: string;
  bio: string;
  photo: string | null;
  linkedin: string;
  twitter: string;
  order: number;
}

export interface EventResult {
  id: number;
  team_name: string;
  project_name: string;
  project_description: string;
  ranking: number;
  prize: string;
  members: string[];
  project_url: string;
  demo_url: string;
}

export interface EventGallery {
  id: number;
  image: string;
  caption: string;
  order: number;
  created_at: string;
}

export interface Event {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  location: string;
  location_url: string;
  is_online: boolean;
  online_link: string;
  max_participants: number;
  max_team_size: number;
  min_team_size: number;
  cover_image: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_featured: boolean;
  total_prize: string;
  prize_currency: string;
  registrations_count: number;
  available_spots: number;
  is_registration_open: boolean;
  schedule?: EventSchedule[];
  speakers?: EventSpeaker[];
  gallery?: EventGallery[];
  results?: EventResult[];
  user_registration?: EventRegistration | null;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event: number;
  team_name: string;
  team_members: string[];
  project_idea: string;
  field: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  notes: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
