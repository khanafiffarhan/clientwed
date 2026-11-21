import { Camera, Building2, Flower2, UtensilsCrossed, Sparkles, Shirt } from "lucide-react";

export const CATEGORIES = [
  { name: "Photography & Videography", icon: Camera, blurb: "Stories told in light and motion" },
  { name: "Wedding Venues", icon: Building2, blurb: "Gardens, halls and waterfronts" },
  { name: "Decoration & Florist", icon: Flower2, blurb: "Stage, flowers and lighting" },
  { name: "Catering Services", icon: UtensilsCrossed, blurb: "Menus your guests will remember" },
  { name: "Makeup & Styling", icon: Sparkles, blurb: "Bridal looks with a trial run" },
  { name: "Wedding Fashion", icon: Shirt, blurb: "Bridal wear and groom attire" },
] as const;
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export type Role = "admin" | "vendor" | "customer";
export interface AppUser {
  id: string; name: string; email: string; image: string | null; role: Role; isBlocked: boolean;
  businessName: string; phone: string; bio: string; subscriptionPlan: "free" | "premium";
  subscriptionExpiresAt: string | null; needsRoleSelection: boolean; createdAt: string;
}
export interface Service {
  _id: string; vendorId: string; serviceName: string; category: string; description: string; price: number;
  location: string; images: string[]; status: "pending" | "approved" | "rejected"; isActive: boolean; createdAt: string;
  vendor?: { id: string; name: string; image?: string | null; email?: string; isPremium?: boolean };
}
export interface Booking {
  _id: string; serviceId: string; vendorId: string; customerId: string; eventDate: string; eventLocation: string;
  message: string; status: "pending" | "accepted" | "rejected" | "cancelled"; createdAt: string;
  service?: { id: string; serviceName?: string; category?: string; images?: string[]; price?: number; location?: string };
  vendor?: { id: string; name?: string; email?: string; image?: string | null; phone?: string };
  customer?: { id: string; name?: string; email?: string; image?: string | null; phone?: string };
}
export interface Paged<T> { items: T[]; total: number; page: number; limit: number }
