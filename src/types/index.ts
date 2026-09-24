/**
 * Domain types for Heritage Loom.
 *
 * These mirror the shapes the planned Go REST API is expected to return, so
 * mock data in `src/data` can later be swapped for API responses without
 * touching components. IDs are strings (UUIDs from PostgreSQL in production).
 */

export type ID = string;

export type CategorySlug =
  | "handwoven-textiles"
  | "gho-kira"
  | "jewellery"
  | "paintings"
  | "woodwork"
  | "handicrafts";

export type RegionSlug =
  | "thimphu"
  | "paro"
  | "punakha"
  | "bumthang"
  | "trongsa"
  | "mongar"
  | "trashigang";

export type ProductType = "Clothing" | "Accessories" | "Home & Living" | "Wall Art" | "Jewellery";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
}

export interface Region {
  slug: RegionSlug;
  name: string;
  /** Neutral, factual descriptor. Avoid unverified craft claims. */
  summary: string;
  image: string;
  /** Position on the illustrative west→east strip (0–100). Not a real map projection. */
  position: { x: number; y: number };
}

export interface CraftMilestone {
  year: string;
  title: string;
  description: string;
}

export interface Artisan {
  id: ID;
  slug: string;
  name: string;
  region: RegionSlug;
  village?: string;
  specialty: string;
  craftTypes: CategorySlug[];
  yearsOfExperience: number;
  portrait: string;
  cover: string;
  shortIntro: string;
  story: string;
  background: string;
  techniques: string[];
  materials: string[];
  journey: CraftMilestone[];
  verified: boolean;
  joined: string;
  rating: number;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  price: number; // Ngultrum (Nu.)
  compareAtPrice?: number;
  category: CategorySlug;
  type: ProductType;
  artisanId: ID;
  region: RegionSlug;
  materials: string[];
  technique: { name: string; description: string };
  story: string;
  culturalSignificance: string;
  summary: string;
  care?: string;
  dimensions?: string;
  productionTime?: string;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  stock: number;
  featured?: boolean;
  createdAt: string; // ISO date
  status: "active" | "draft" | "pending" | "rejected";
}

export interface Review {
  id: ID;
  productId: ID;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface CartItem {
  productId: ID;
  quantity: number;
}

export type OrderStatus = "placed" | "paid" | "preparing" | "shipped" | "delivered" | "cancelled";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  address: string;
  dzongkhag: string;
  gewog: string;
  notes?: string;
}

export interface OrderLine {
  productId: ID;
  quantity: number;
  unitPrice: number;
}

export interface PaymentProof {
  screenshotDataUrl: string;
  transactionNumber: string;
}

export type PaymentVerificationStatus = "not-required" | "awaiting-verification" | "verified";

export interface Order {
  id: ID;
  number: string; // e.g. HL-2026-0001
  customerName: string;
  lines: OrderLine[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodId;
  paymentVerification: PaymentVerificationStatus;
  paymentProof?: PaymentProof;
  address: DeliveryAddress;
  placedAt: string;
  estimatedDelivery: string;
  history: { status: OrderStatus; date: string }[];
}

export type PaymentMethodId = "mobile-banking" | "cash-on-delivery";

export type UserRole = "customer" | "artisan" | "admin";

export interface SessionUser {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  artisanId?: ID;
}

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ArtisanApplication {
  id: ID;
  name: string;
  location: string;
  craft: string;
  appliedOn: string;
  status: ApprovalStatus;
  note: string;
}

export interface PlatformUser {
  id: ID;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  orders: number;
  status: "active" | "suspended";
}
