import type { Category, CategorySlug } from "@/types";
import { media } from "./media";

/** DEMO DATA — categories will come from GET /api/v1/categories. */
export const categories: Category[] = [
  {
    slug: "handwoven-textiles",
    name: "Handwoven Textiles",
    shortDescription: "Backstrap and frame-loom weaving in cotton, wool and silk.",
    description:
      "Thagzo — the art of weaving — is one of Bhutan's thirteen traditional arts (Zorig Chusum). Each textile carries patterns passed from mother to daughter, woven thread by thread over weeks or months.",
    image: media.handwovenJacket,
  },
  {
    slug: "gho-kira",
    name: "Gho & Kira",
    shortDescription: "The national dress, tailored from handwoven cloth.",
    description:
      "The gho and kira are worn every day across Bhutan — at school, at work and at festivals. Handwoven versions are treasured and often passed down through families.",
    image: media.ghoKiraLifestyle,
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    shortDescription: "Silver and gold ornaments shaped by traditional smiths.",
    description:
      "Troeko — ornament making — covers the silver and gold work used in jewellery, brooches and ceremonial pieces, hand-chased and engraved with care.",
    image: media.earringsSilver,
  },
  {
    slug: "paintings",
    name: "Paintings",
    shortDescription: "Traditional painting with mineral pigments and fine line work.",
    description:
      "Lhazo — the art of painting — follows strict proportions and a disciplined palette. Many painters train for years before completing their first major work.",
    image: media.paintingsDisplay,
  },
  {
    slug: "woodwork",
    name: "Woodwork",
    shortDescription: "Turned bowls and carved panels from Himalayan timber.",
    description:
      "Shagzo (wood turning) and Parzo (carving) turn local timber into bowls, cups and architectural details found in homes across the country.",
    image: media.woodenBowl,
  },
  {
    slug: "handicrafts",
    name: "Handicrafts",
    shortDescription: "Bags, baskets and everyday objects made by hand.",
    description:
      "From cane and bamboo work to small woven accessories, handicrafts bring traditional skill into objects made for daily use.",
    image: media.bagStriped,
  },
];

export const categoryBySlug = (slug: CategorySlug) =>
  categories.find((c) => c.slug === slug)!;
