export type StandCategory = 
  | 'restaurante'
  | 'bar'
  | 'belleza'
  | 'spa_unas'
  | 'veterinaria'
  | 'medico'
  | 'ropa'
  | 'calzado'
  | 'otro';

export type ReservationType = 
  | 'restaurant'
  | 'bar'
  | 'beauty'
  | 'nails'
  | 'vet'
  | 'doctor'
  | 'fashion'
  | 'footwear'
  | 'general';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  variants?: string[];
  isService?: boolean;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle?: string;
  mediaType: 'image' | 'video' | 'gif';
  mediaUrl: string;
  linkUrl?: string;
  ctaText?: string;
  badge?: string;
  active: boolean;
}

export interface SocialLinks {
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  website: string;
  phone: string;
}

export interface PaymentGatewayConfig {
  nequiEnabled: boolean;
  nequiNumber: string;
  daviplataEnabled: boolean;
  daviplataNumber: string;
  mercadopagoEnabled: boolean;
  mercadopagoKey: string;
  stripeEnabled: boolean;
  wompiEnabled: boolean;
  paypalEnabled: boolean;
  paypalEmail: string;
  cashOnDeliveryEnabled: boolean;
  bankTransferEnabled: boolean;
  bankDetails: string;
}

export interface Reservation {
  id: string;
  standId: string;
  standName?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string;
  time: string;
  details: Record<string, string | number>;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  createdAt: string;
  notes?: string;
}

export interface Stand {
  id: string;
  slug: string;
  name: string;
  category: StandCategory;
  tagline: string;
  description: string;
  accessPin: string; // PIN for owner management
  logo: string;
  banner: string;
  themeColor: string; // hex or tailwind token
  schedule: string;
  address: string;
  rating: number;
  reviewCount: number;
  products: Product[];
  ads: Advertisement[];
  socials: SocialLinks;
  paymentGateways: PaymentGatewayConfig;
  reservationsEnabled: boolean;
  reservationType: ReservationType;
  createdAt: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  standId: string;
  standName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: string;
  notes?: string;
}

export interface Order {
  id: string;
  standId: string;
  standName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  status: 'recibido' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
  createdAt: string;
  notes?: string;
}
