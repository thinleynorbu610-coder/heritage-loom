export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Artisans", href: "/artisans" },
  { label: "Our Story", href: "/our-story" },
] as const;

export const footerNav = {
  Explore: [
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Artisans", href: "/artisans" },
    { label: "Track an Order", href: "/track-order" },
  ],
  "Heritage Loom": [
    { label: "About Heritage Loom", href: "/our-story" },

    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ],
};
