export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slogan?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  tax_number?: string;
  business_hours: Record<string, any>;
  social_media: Record<string, string>;
  logo_url?: string;
  favicon_url?: string;
  tps_rate: number;
  tvq_rate: number;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url?: string;
  allergens: string[];
  ingredients: string[];
  preparation_time: number;
  calories?: number;
  is_available: boolean;
  is_festive: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  client_id: string;
  quote_number: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: QuoteItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  valid_until: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  client_id: string;
  quote_id?: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  delivery_date: string;
  delivery_address?: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Reservation {
  id: string;
  client_id: string;
  event_date: string;
  event_time: string;
  guest_count: number;
  event_type: string;
  venue?: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  unit_cost: number;
  supplier?: string;
  last_order_date?: string;
  expiration_date?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  reference?: string;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  points_per_dollar: number;
  minimum_points_redemption: number;
  rewards: LoyaltyReward[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  points_required: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
}

export interface ClientLoyalty {
  id: string;
  client_id: string;
  points_balance: number;
  total_points_earned: number;
  total_points_redeemed: number;
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  styles: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  position: 'top' | 'bottom' | 'modal';
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  type: 'direct' | 'broadcast';
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}