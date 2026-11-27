import type { Region, RegionSlug } from "@/types";

/**
 * Regions featured on the marketplace, ordered west → east.
 *
 * - `coordinates` are the real locations of each dzongkhag's administrative
 *   dzong (from Wikipedia), used to centre the Google Map in <RegionExplorer>.
 * - Photos are from Wikimedia Commons, stored in /public/images/regions and
 *   shown with their licence credit (CC BY / CC BY-SA require attribution).
 */
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;

export const regions: Region[] = [
  {
    slug: "paro",
    name: "Paro",
    landmark: "Rinpung Dzong",
    summary: "A broad western valley known for its historic dzong and farmhouses.",
    image: "/images/regions/paro.jpg",
    imageCredit: { author: "Bernard Gagnon", license: "CC BY-SA 4.0", source: commons("Rinpung Dzong, Bhutan 01.jpg") },
    coordinates: { lat: 27.4267, lon: 89.4233 },
  },
  {
    slug: "thimphu",
    name: "Thimphu",
    landmark: "Tashichho Dzong",
    summary: "The capital, home to the National Institute for Zorig Chusum.",
    image: "/images/regions/thimphu.jpg",
    imageCredit: { author: "Bernard Gagnon", license: "CC BY-SA 4.0", source: commons("Tashichho Dzong, Bhutan 03.jpg") },
    coordinates: { lat: 27.4894, lon: 89.635 },
  },
  {
    slug: "punakha",
    name: "Punakha",
    landmark: "Punakha Dzong",
    summary: "A warm river valley at the meeting of the Pho Chhu and Mo Chhu.",
    image: "/images/regions/punakha.jpg",
    imageCredit: { author: "Bernard Gagnon", license: "CC BY-SA 4.0", source: commons("Punakha Dzong, Bhutan 05.jpg") },
    coordinates: { lat: 27.5819, lon: 89.8631 },
  },
  {
    slug: "trongsa",
    name: "Trongsa",
    landmark: "Trongsa Dzong",
    summary: "The historic centre of the country, above a deep river gorge.",
    image: "/images/regions/trongsa.jpg",
    imageCredit: { author: "Christopher J. Fynn", license: "CC BY-SA 4.0", source: commons("Trongsa Dzong 2021-10-24a.jpg") },
    coordinates: { lat: 27.4994, lon: 90.5047 },
  },
  {
    slug: "bumthang",
    name: "Bumthang",
    landmark: "Jakar Dzong",
    summary: "Central highland valleys known for yathra, hand-woven wool.",
    image: "/images/regions/bumthang.jpg",
    imageCredit: { author: "PgyamtshoBT", license: "CC0", source: commons("Jakar Dzong in Bumthang.jpg") },
    coordinates: { lat: 27.5489, lon: 90.7436 },
  },
  {
    slug: "mongar",
    name: "Mongar",
    landmark: "Mongar Dzong",
    summary: "An eastern hillside town on the lateral road through the east.",
    image: "/images/regions/mongar.jpg",
    imageCredit: { author: "Christopher J. Fynn", license: "CC BY-SA 3.0", source: commons("View of Mongar town.jpg") },
    coordinates: { lat: 27.2757, lon: 91.2398 }, // Wikipedia has none; position from Google Maps
  },
  {
    slug: "trashigang",
    name: "Trashigang",
    landmark: "Trashigang Dzong",
    summary: "The far east, with a strong tradition of silk and cotton weaving.",
    image: "/images/regions/trashigang.jpg",
    imageCredit: { author: "Arian Zwegers", license: "CC BY 2.0", source: commons("Tashigang Dzong (15820296856).jpg") },
    coordinates: { lat: 27.3368, lon: 91.5514 },
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
