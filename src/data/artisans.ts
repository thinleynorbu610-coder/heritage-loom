import type { Artisan } from "@/types";
import { media } from "./media";

/**
 * DEMO DATA — fictional artisans for the prototype.
 * Names, stories and photos are placeholders; replace with real artisan
 * profiles (with consent) from GET /api/v1/artisans.
 */
export const artisans: Artisan[] = [
  {
    id: "art-001",
    slug: "pema-choden",
    name: "Pema Choden",
    region: "thimphu",
    village: "Changzamtog",
    specialty: "Textile Weaver",
    craftTypes: ["handwoven-textiles", "gho-kira"],
    yearsOfExperience: 18,
    portrait: media.elderTraditional,
    cover: media.loomWoman,
    shortIntro:
      "Weaves kira and fine scarves on a backstrap loom, specialising in dense supplementary-weft patterns.",
    story:
      "Pema learned to weave beside her grandmother, counting threads before she could read. Today she works from a sunlit room above her family home in Thimphu, where the rhythm of the loom begins every morning after tea. She is known for patterns so tight that the back of the cloth is almost as neat as the front.",
    background:
      "After finishing school, Pema trained further in textile arts in Thimphu and spent several years weaving on commission for families preparing for weddings and festivals. Selling online lets her reach customers outside the capital without leaving her loom.",
    techniques: ["Backstrap loom weaving", "Supplementary-weft patterning", "Hand finishing & fringing"],
    materials: ["Cotton", "Silk", "Naturally dyed yarn"],
    journey: [
      { year: "2006", title: "First loom", description: "Receives her grandmother's backstrap loom and weaves her first rachu." },
      { year: "2011", title: "Formal training", description: "Refines pattern work and colour theory through further textile study." },
      { year: "2017", title: "Commission work", description: "Weaves kira for weddings and festivals for families across Thimphu." },
      { year: "2024", title: "Teaching", description: "Begins teaching two young weavers from her neighbourhood." },
      { year: "2026", title: "Joins Heritage Loom", description: "Opens her first online storefront to reach customers nationwide." },
    ],
    verified: true,
    joined: "2026-01-12",
    rating: 4.9,
  },
  {
    id: "art-002",
    slug: "sonam-wangmo",
    name: "Sonam Wangmo",
    region: "paro",
    village: "Shaba",
    specialty: "Traditional Textile Artist",
    craftTypes: ["handwoven-textiles", "handicrafts"],
    yearsOfExperience: 12,
    portrait: media.traditionalDress,
    cover: media.loomSeated,
    shortIntro:
      "Blends classic Paro colourways with contemporary everyday pieces — bags, runners and scarves.",
    story:
      "Sonam grew up in a farming family where weaving filled the quiet winter months. She now runs a small workshop with her sister, turning offcuts of handwoven cloth into bags and pouches so that nothing from the loom is wasted.",
    background:
      "Sonam began selling at local craft fairs and weekend markets. Heritage Loom gives her a steady channel for her workshop and helps her tell customers the story behind each piece.",
    techniques: ["Frame-loom weaving", "Hand stitching", "Pattern repair & upcycling"],
    materials: ["Cotton", "Wool", "Cotton lining"],
    journey: [
      { year: "2014", title: "Winter weaving", description: "Starts weaving seriously during the farm's winter season." },
      { year: "2018", title: "Market stall", description: "Sells her first bags at weekend craft markets." },
      { year: "2022", title: "Workshop", description: "Opens a two-person workshop with her sister." },
      { year: "2026", title: "Online storefront", description: "Brings her collection to Heritage Loom." },
    ],
    verified: true,
    joined: "2026-02-03",
    rating: 4.8,
  },
  {
    id: "art-003",
    slug: "tashi-dorji",
    name: "Tashi Dorji",
    region: "punakha",
    village: "Lobesa",
    specialty: "Wood Craftsman",
    craftTypes: ["woodwork"],
    yearsOfExperience: 22,
    portrait: media.woodworker,
    cover: media.carverHands,
    shortIntro:
      "Turns bowls and cups from seasoned timber on a foot-powered lathe, finished with natural lacquer.",
    story:
      "Tashi's workshop smells of fresh shavings and wood smoke. He selects each block himself, letting it season for months before turning. He believes a good bowl should feel warm in the hand and last long enough to be passed on.",
    background:
      "Trained in wood turning as a young man, Tashi has supplied bowls to households and restaurants in Punakha and Wangdue for two decades.",
    techniques: ["Shagzo (wood turning)", "Hand carving", "Natural lacquer finishing"],
    materials: ["Seasoned hardwood", "Natural lacquer", "Beeswax"],
    journey: [
      { year: "2004", title: "Apprenticeship", description: "Apprentices under a master wood turner." },
      { year: "2010", title: "Own lathe", description: "Builds his own lathe and opens a workshop in Lobesa." },
      { year: "2019", title: "Master pieces", description: "Known locally for lidded bowls with perfectly fitted lids." },
      { year: "2026", title: "Heritage Loom", description: "Begins selling online to customers across Bhutan." },
    ],
    verified: true,
    joined: "2026-01-20",
    rating: 4.9,
  },
  {
    id: "art-004",
    slug: "dechen-lhamo",
    name: "Dechen Lhamo",
    region: "bumthang",
    village: "Chumey",
    specialty: "Handwoven Textiles",
    craftTypes: ["handwoven-textiles"],
    yearsOfExperience: 15,
    portrait: media.weaverFloor,
    cover: media.loomColour,
    shortIntro:
      "Weaves warm wool yathra in bold geometric bands — throws, scarves and jackets.",
    story:
      "In the cold highland valleys, wool is everything. Dechen spins, dyes and weaves yathra in narrow strips that are later stitched together. Her colour combinations take inspiration from the fields around her village through the seasons.",
    background:
      "Dechen's family has woven yathra for several generations. She manages every step herself — from carding the wool to the final stitching of panels.",
    techniques: ["Yathra wool weaving", "Hand spinning", "Natural dyeing"],
    materials: ["Sheep wool", "Yak wool", "Natural dyes"],
    journey: [
      { year: "2011", title: "Family craft", description: "Joins her mother at the loom full time." },
      { year: "2016", title: "Natural dyes", description: "Experiments with plant-based dyes for deeper, softer colours." },
      { year: "2023", title: "New products", description: "Designs lighter yathra scarves for everyday wear." },
      { year: "2026", title: "Heritage Loom", description: "Opens her storefront to customers beyond Bumthang." },
    ],
    verified: true,
    joined: "2026-02-15",
    rating: 4.7,
  },
  {
    id: "art-005",
    slug: "karma-tenzin",
    name: "Karma Tenzin",
    region: "thimphu",
    village: "Motithang",
    specialty: "Traditional Painter",
    craftTypes: ["paintings"],
    yearsOfExperience: 10,
    portrait: media.muralPainter,
    cover: media.paintingsDisplay,
    shortIntro:
      "Paints in the traditional style with mineral pigments, from small panels to large wall pieces.",
    story:
      "Karma spent years mastering proportion grids before painting a single original piece. He mixes his own pigments and still grinds some colours by hand. His work balances discipline with small, personal details that reward a closer look.",
    background:
      "Karma trained in traditional painting in Thimphu and has worked on restoration and decorative projects before focusing on his own studio pieces.",
    techniques: ["Lhazo (traditional painting)", "Mineral pigment preparation", "Fine line work"],
    materials: ["Cotton canvas", "Mineral pigments", "Gold detailing"],
    journey: [
      { year: "2014", title: "Training begins", description: "Starts formal training in traditional painting." },
      { year: "2019", title: "Restoration work", description: "Assists on decorative and restoration projects." },
      { year: "2023", title: "Own studio", description: "Opens a small studio in Motithang." },
      { year: "2026", title: "Heritage Loom", description: "Offers ready-to-hang pieces online." },
    ],
    verified: true,
    joined: "2026-03-01",
    rating: 4.9,
  },
  {
    id: "art-006",
    slug: "ugyen-namgyel",
    name: "Ugyen Namgyel",
    region: "trongsa",
    specialty: "Silversmith",
    craftTypes: ["jewellery"],
    yearsOfExperience: 16,
    portrait: media.festivalGroup,
    cover: media.earringsSilver,
    shortIntro:
      "Hand-forges silver earrings, brooches and rings with engraved traditional motifs.",
    story:
      "Ugyen's small bench sits by a window overlooking the valley. Every piece begins as a silver ingot that he melts, hammers and engraves by hand. He enjoys making pieces that people wear every day rather than keep in a box.",
    background:
      "Ugyen trained in Troeko — ornament making — and worked for a jeweller in Thimphu before returning home to open his own bench.",
    techniques: ["Troeko (ornament making)", "Hand engraving", "Filigree"],
    materials: ["Sterling silver", "Coral", "Turquoise"],
    journey: [
      { year: "2010", title: "Training", description: "Begins training in traditional ornament making." },
      { year: "2015", title: "City workshop", description: "Works for an established jeweller in Thimphu." },
      { year: "2021", title: "Returns home", description: "Opens his own bench in Trongsa." },
      { year: "2026", title: "Heritage Loom", description: "Launches his first online collection." },
    ],
    verified: true,
    joined: "2026-03-10",
    rating: 4.8,
  },
  {
    id: "art-007",
    slug: "yeshi-choden",
    name: "Yeshi Choden",
    region: "trashigang",
    specialty: "Silk Weaver",
    craftTypes: ["handwoven-textiles", "gho-kira"],
    yearsOfExperience: 20,
    portrait: media.loomSeated,
    cover: media.textileBWR,
    shortIntro:
      "Weaves lustrous raw-silk cloth for kira and ceremonial scarves in the east.",
    story:
      "Yeshi's cloth has a quiet sheen that changes with the light. She works slowly, often completing only one full kira panel in several weeks, and keeps a notebook of every pattern she has woven.",
    background:
      "Yeshi learned silk weaving from her mother and now teaches younger women in her community, keeping patterns alive through practice.",
    techniques: ["Raw-silk weaving", "Backstrap loom", "Pattern recording"],
    materials: ["Raw silk", "Cotton", "Natural dyes"],
    journey: [
      { year: "2006", title: "Learns from her mother", description: "Begins weaving raw-silk cloth at home." },
      { year: "2014", title: "Pattern notebook", description: "Starts documenting every pattern she weaves." },
      { year: "2020", title: "Community teacher", description: "Teaches weaving to young women nearby." },
      { year: "2026", title: "Heritage Loom", description: "Brings eastern silk weaving to a wider audience." },
    ],
    verified: true,
    joined: "2026-04-02",
    rating: 5,
  },
  {
    id: "art-008",
    slug: "sangay-dema",
    name: "Sangay Dema",
    region: "mongar",
    specialty: "Handicraft Maker",
    craftTypes: ["handicrafts", "handwoven-textiles"],
    yearsOfExperience: 8,
    portrait: media.paperArtisan,
    cover: media.bagsHanging,
    shortIntro:
      "Makes practical bags and pouches from handwoven cloth, built for everyday life.",
    story:
      "Sangay started by repairing her neighbours' bags and soon began designing her own. She pairs handwoven panels with sturdy linings and leather details so they last through years of daily use.",
    background:
      "A self-taught maker, Sangay now works with three weavers in her community who supply the cloth for her designs.",
    techniques: ["Hand stitching", "Panel construction", "Leather detailing"],
    materials: ["Handwoven cotton", "Leather", "Cotton lining"],
    journey: [
      { year: "2018", title: "Repairs", description: "Starts repairing bags for friends and neighbours." },
      { year: "2021", title: "First designs", description: "Creates her first bags from handwoven panels." },
      { year: "2024", title: "Weaver network", description: "Partners with three local weavers." },
      { year: "2026", title: "Heritage Loom", description: "Opens her storefront online." },
    ],
    verified: false,
    joined: "2026-05-18",
    rating: 4.6,
  },
];

export const artisanById = (id: string) => artisans.find((a) => a.id === id);
export const artisanBySlug = (slug: string) => artisans.find((a) => a.slug === slug);
