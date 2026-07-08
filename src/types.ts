export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  stock: number;
  ecoFriendly: boolean;
  points: number;
  isBestSeller?: boolean;
  discount?: number;
  specs: ProductSpec[];
  colors: ProductColor[];
  reviews: Review[];
  images?: string[];
  sizes?: string[];
  qas?: { id: string; question: string; answer: string; date: string; helpfulCount: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize?: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image: string;
  details?: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Return Requested';
  trackingNumber: string;
  tax?: number;
  shipping?: number;
  grandTotal?: number;
  expectedDelivery?: string;
  carrier?: string;
  carrierUrl?: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2: string;
    country: string;
  };
  paymentMethod?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  points: number;
  orderHistory: Order[];
}

export interface FilterState {
  category: string;
  subcategory: string[];
  priceRange: [number, number];
  brands: string[];
  ratings: number[];
  inStockOnly: boolean;
  ecoFriendlyOnly: boolean;
}
