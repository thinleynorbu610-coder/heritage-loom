import type { Region, RegionSlug } from "@/types";
import { media } from "./media";

/**
 * DEMO DATA — regions featured on the marketplace.
 * Summaries are intentionally general; `position` places each dzongkhag on an
 * illustrative west→east strip and is NOT a geographic projection.
 */
export const regions: Region[] = [
  {
    slug: "paro",
    name: "Paro",
    summary: "A broad western valley known for its historic dzong and farmhouses.",
    image: media.taktsang,
    position: { x: 8, y: 58 },
  },
  {
    slug: "thimphu",
    name: "Thimphu",
    summary: "The capital, home to the National Institute for Zorig Chusum.",
    image: media.thimphuValley,
    position: { x: 18, y: 44 },
  },
  {
    slug: "punakha",
    name: "Punakha",
    summary: "A warm river valley at the meeting of the Pho Chhu and Mo Chhu.",
    image: media.punakhaDzong,
    position: { x: 28, y: 36 },
  },
  {
    slug: "trongsa",
    name: "Trongsa",
    summary: "The historic centre of the country, above a deep river gorge.",
    image: media.cliffMonastery,
    position: { x: 47, y: 52 },
  },
  {
    slug: "bumthang",
    name: "Bumthang",
    summary: "Central highland valleys known for yathra, hand-woven wool.",
    image: media.bumthangFields,
    position: { x: 57, y: 34 },
  },
  {
    slug: "mongar",
    name: "Mongar",
    summary: "An eastern hillside town on the lateral road through the east.",
    image: media.mountainHouse,
    position: { x: 75, y: 46 },
  },
  {
    slug: "trashigang",
    name: "Trashigang",
    summary: "The far east, with a strong tradition of silk and cotton weaving.",
    image: media.riverDzong,
    position: { x: 90, y: 56 },
  },
];

export const regionBySlug = (slug: RegionSlug) => regions.find((r) => r.slug === slug)!;

/** All 20 dzongkhags, used for delivery address forms. */
export const dzongkhags = [
  "Bumthang",
  "Chhukha",
  "Dagana",
  "Gasa",
  "Haa",
  "Lhuentse",
  "Mongar",
  "Paro",
  "Pemagatshel",
  "Punakha",
  "Samdrup Jongkhar",
  "Samtse",
  "Sarpang",
  "Thimphu",
  "Trashigang",
  "Trashiyangtse",
  "Trongsa",
  "Tsirang",
  "Wangdue Phodrang",
  "Zhemgang",
] as const;
