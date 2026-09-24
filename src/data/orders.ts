import type { ArtisanApplication, Order, PlatformUser } from "@/types";

/**
 * DEMO DATA — orders, users and artisan applications used by the customer,
 * artisan and admin dashboards. Replace with authenticated API calls.
 */
export const demoOrders: Order[] = [
  {
    id: "ord-003",
    number: "HL-2026-0003",
    customerName: "Tenzin Norbu",
    lines: [
      { productId: "prd-003", quantity: 1, unitPrice: 2400 },
      { productId: "prd-011", quantity: 1, unitPrice: 3600 },
    ],
    subtotal: 6000,
    delivery: 0,
    total: 6000,
    status: "shipped",
    paymentMethod: "mobile-banking",
    paymentVerification: "verified",
    address: { fullName: "Tenzin Norbu", phone: "17 12 34 56", address: "House 12, Norzin Lam", dzongkhag: "Thimphu", gewog: "Chang" },
    placedAt: "2026-09-18",
    estimatedDelivery: "2026-09-25",
    history: [
      { status: "placed", date: "2026-09-18" },
      { status: "paid", date: "2026-09-18" },
      { status: "preparing", date: "2026-09-19" },
      { status: "shipped", date: "2026-09-21" },
    ],
  },
  {
    id: "ord-002",
    number: "HL-2026-0002",
    customerName: "Tenzin Norbu",
    lines: [{ productId: "prd-001", quantity: 1, unitPrice: 3800 }],
    subtotal: 3800,
    delivery: 150,
    total: 3950,
    status: "delivered",
    paymentMethod: "mobile-banking",
    paymentVerification: "verified",
    address: { fullName: "Tenzin Norbu", phone: "17 12 34 56", address: "House 12, Norzin Lam", dzongkhag: "Thimphu", gewog: "Chang" },
    placedAt: "2026-08-29",
    estimatedDelivery: "2026-09-04",
    history: [
      { status: "placed", date: "2026-08-29" },
      { status: "paid", date: "2026-08-29" },
      { status: "preparing", date: "2026-08-30" },
      { status: "shipped", date: "2026-09-01" },
      { status: "delivered", date: "2026-09-03" },
    ],
  },
  {
    id: "ord-001",
    number: "HL-2026-0001",
    customerName: "Tenzin Norbu",
    lines: [{ productId: "prd-005", quantity: 1, unitPrice: 4200 }],
    subtotal: 4200,
    delivery: 150,
    total: 4350,
    status: "preparing",
    paymentMethod: "cash-on-delivery",
    paymentVerification: "not-required",
    address: { fullName: "Tenzin Norbu", phone: "17 12 34 56", address: "House 12, Norzin Lam", dzongkhag: "Thimphu", gewog: "Chang" },
    placedAt: "2026-09-21",
    estimatedDelivery: "2026-09-28",
    history: [
      { status: "placed", date: "2026-09-21" },
      { status: "paid", date: "2026-09-21" },
      { status: "preparing", date: "2026-09-22" },
    ],
  },
];

/** Orders received by the demo artisan (Pema Choden) — seller dashboard. */
export const sellerOrders = [
  { id: "so-1", number: "HL-2026-0142", customer: "Deki Wangmo", productId: "prd-002", quantity: 1, total: 28500, date: "2026-09-22", status: "pending" as const, dzongkhag: "Thimphu" },
  { id: "so-2", number: "HL-2026-0139", customer: "Karma Choki", productId: "prd-008", quantity: 1, total: 16650, date: "2026-09-21", status: "paid" as const, dzongkhag: "Paro" },
  { id: "so-3", number: "HL-2026-0131", customer: "Namgay Peldon", productId: "prd-002", quantity: 1, total: 28650, date: "2026-09-18", status: "shipped" as const, dzongkhag: "Sarpang" },
  { id: "so-4", number: "HL-2026-0120", customer: "Jigme Tobgay", productId: "prd-008", quantity: 1, total: 16500, date: "2026-09-12", status: "delivered" as const, dzongkhag: "Thimphu" },
  { id: "so-5", number: "HL-2026-0117", customer: "Chimi Lhamo", productId: "prd-008", quantity: 2, total: 33150, date: "2026-09-10", status: "delivered" as const, dzongkhag: "Chhukha" },
  { id: "so-6", number: "HL-2026-0144", customer: "Sonam Dorji", productId: "prd-008", quantity: 1, total: 16650, date: "2026-09-23", status: "pending" as const, dzongkhag: "Bumthang" },
];

export type SellerOrderStatus = (typeof sellerOrders)[number]["status"];

/** Monthly sales for the demo artisan, in Nu. */
export const sellerMonthlySales = [
  { month: "Apr", value: 31000 },
  { month: "May", value: 45500 },
  { month: "Jun", value: 38200 },
  { month: "Jul", value: 62800 },
  { month: "Aug", value: 58400 },
  { month: "Sep", value: 76300 },
];

/** Platform-wide monthly orders — admin reports. */
export const platformMonthlyOrders = [
  { month: "Apr", value: 86 },
  { month: "May", value: 124 },
  { month: "Jun", value: 139 },
  { month: "Jul", value: 188 },
  { month: "Aug", value: 214 },
  { month: "Sep", value: 257 },
];

export const artisanApplications: ArtisanApplication[] = [
  { id: "app-1", name: "Kinley Wangchuk", location: "Trashiyangtse", craft: "Wood turning", appliedOn: "2026-09-22", status: "pending", note: "Family workshop producing turned bowls; 3 product samples attached." },
  { id: "app-2", name: "Tshering Yangzom", location: "Lhuentse", craft: "Textile weaving", appliedOn: "2026-09-21", status: "pending", note: "Weaver of patterned kira; photos of 5 recent works." },
  { id: "app-3", name: "Phub Dorji", location: "Haa", craft: "Bamboo & cane work", appliedOn: "2026-09-19", status: "pending", note: "Cooperative of 6 makers; requests a cooperative storefront (Phase 2)." },
  { id: "app-4", name: "Sangay Dema", location: "Mongar", craft: "Handicrafts", appliedOn: "2026-05-15", status: "approved", note: "Approved after ID and sample review." },
  { id: "app-5", name: "Rinzin Om", location: "Samtse", craft: "Jewellery", appliedOn: "2026-09-02", status: "rejected", note: "Items appeared to be imported; invited to reapply with making-process photos." },
];

export const platformUsers: PlatformUser[] = [
  { id: "usr-1", name: "Tenzin Norbu", email: "tenzin@example.bt", role: "customer", joined: "2026-03-14", orders: 3, status: "active" },
  { id: "usr-2", name: "Deki Wangmo", email: "deki@example.bt", role: "customer", joined: "2026-04-02", orders: 5, status: "active" },
  { id: "usr-3", name: "Pema Choden", email: "pema@example.bt", role: "artisan", joined: "2026-01-12", orders: 0, status: "active" },
  { id: "usr-4", name: "Karma Choki", email: "karma.c@example.bt", role: "customer", joined: "2026-05-19", orders: 2, status: "active" },
  { id: "usr-5", name: "Tashi Dorji", email: "tashi@example.bt", role: "artisan", joined: "2026-01-20", orders: 0, status: "active" },
  { id: "usr-6", name: "Namgay Peldon", email: "namgay@example.bt", role: "customer", joined: "2026-06-07", orders: 1, status: "suspended" },
  { id: "usr-7", name: "Admin Team", email: "admin@heritageloom.bt", role: "admin", joined: "2026-01-01", orders: 0, status: "active" },
  { id: "usr-8", name: "Jigme Tobgay", email: "jigme@example.bt", role: "customer", joined: "2026-07-23", orders: 4, status: "active" },
];

export const platformStats = {
  users: 1284,
  artisans: 86,
  products: 642,
  orders: 1008,
};
