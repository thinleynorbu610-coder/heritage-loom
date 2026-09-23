import type { Review } from "@/types";

/** DEMO DATA — sample customer reviews (Phase 2 feature). */
export const reviews: Review[] = [
  { id: "rev-001", productId: "prd-001", author: "Kinzang D.", location: "Thimphu", rating: 5, title: "Warm and beautifully made", body: "The colours are even richer in person. It's thick enough for Thimphu winters and the edges are finished perfectly.", date: "2026-09-12", verifiedPurchase: true },
  { id: "rev-002", productId: "prd-001", author: "Chimi L.", location: "Paro", rating: 5, title: "Gift for my mother", body: "She recognised it as Bumthang yathra straight away. Loved reading the story card that came with it.", date: "2026-08-30", verifiedPurchase: true },
  { id: "rev-003", productId: "prd-001", author: "Tshering Y.", location: "Phuentsholing", rating: 4, title: "Lovely, slightly itchy", body: "Real wool so a little scratchy against the neck at first, but it softened after a week. Great value for handwoven.", date: "2026-08-02", verifiedPurchase: true },
  { id: "rev-004", productId: "prd-002", author: "Deki W.", location: "Thimphu", rating: 5, title: "An heirloom", body: "The motifs are so fine. I wore it for Losar and received so many compliments. Worth every ngultrum.", date: "2026-09-01", verifiedPurchase: true },
  { id: "rev-005", productId: "prd-002", author: "Namgay P.", location: "Gelephu", rating: 5, title: "Delivered with care", body: "Packed in cloth with a handwritten note from the weaver. It felt personal.", date: "2026-08-14", verifiedPurchase: true },
  { id: "rev-006", productId: "prd-003", author: "Sonam T.", location: "Punakha", rating: 5, title: "Perfect lid fit", body: "The lid closes with a soft click. You can tell it was turned from one block.", date: "2026-09-16", verifiedPurchase: true },
  { id: "rev-007", productId: "prd-003", author: "Jigme N.", location: "Thimphu", rating: 5, title: "Beautiful grain", body: "Using it every day for rice. Warm, light and very well finished.", date: "2026-09-05", verifiedPurchase: true },
  { id: "rev-008", productId: "prd-003", author: "Pelden C.", location: "Trongsa", rating: 4, title: "Smaller than expected", body: "Check the dimensions — it's a personal-size bowl. Quality is excellent.", date: "2026-08-21", verifiedPurchase: false },
  { id: "rev-009", productId: "prd-005", author: "Ugyen L.", location: "Mongar", rating: 5, title: "Light and elegant", body: "Comfortable to wear all day. The engraving is very fine.", date: "2026-09-18", verifiedPurchase: true },
  { id: "rev-010", productId: "prd-006", author: "Karma C.", location: "Paro", rating: 4, title: "Sturdy everyday bag", body: "Great for the market. I'd love an inner zip pocket in the next version.", date: "2026-09-09", verifiedPurchase: true },
  { id: "rev-011", productId: "prd-004", author: "Dorji W.", location: "Thimphu", rating: 5, title: "Remarkable detail", body: "The gold line work catches the evening light beautifully. Arrived well protected.", date: "2026-08-11", verifiedPurchase: true },
];

export const reviewsForProduct = (productId: string) =>
  reviews.filter((r) => r.productId === productId);
