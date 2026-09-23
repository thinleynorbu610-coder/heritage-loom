/**
 * Central media registry — DEMO PHOTOGRAPHY ONLY.
 *
 * Every image used by the site is referenced from here, so replacing demo
 * photos with Heritage Loom's own uploaded media (object storage) is a
 * one-file change. Images come from Unsplash (free licence) and are used
 * as placeholders; artisan portraits and product shots should be replaced
 * with real, consented photography of the actual makers and products.
 *
 * If any URL fails to load, <SmartImage> renders a woven-pattern fallback,
 * so the layout never breaks.
 */

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

export const media = {
  // Landscapes & architecture of Bhutan
  heroValley: u("photo-1580649851649-992b28f56e98", 2400), // dzong by a river
  punakhaDzong: u("photo-1729176989417-10cab5aa9076"),
  punakhaRiver: u("photo-1602058033339-b9325bb3a6c3"),
  dzongBalconies: u("photo-1729176990266-9524f1497bab"),
  dzongWindows: u("photo-1649932362638-ad9d984659ef"),
  dzongFlowers: u("photo-1649932362540-5be7f8113e35"),
  taktsang: u("photo-1578556881786-851d4b79cb73"),
  cliffMonastery: u("photo-1590580673100-ee7ee687bfa6"),
  mountainHouse: u("photo-1729174518995-8c4546b3dd53"),
  thimphuValley: u("photo-1597658333270-8c0d8f0eb845"),
  thimphuCity: u("photo-1635134873780-4ffac86376e4"),
  thimphuAerial: u("photo-1590319820990-a441684ad0e3"),
  bumthangFields: u("photo-1584003734930-b12779f66351"),
  greenHills: u("photo-1629778662699-b6c4362230d9"),
  riverDzong: u("photo-1608236475087-615bfbcdf772"),
  suspensionBridge: u("photo-1650747858910-5d48a4116296"),
  prayerFlagRoof: u("photo-1761048168516-337c853bcf11"),

  // People (placeholder portraits — replace with consenting artisans)
  elderTraditional: u("photo-1769967359432-71ae8e3beaae", 1200),
  traditionalDress: u("photo-1581587697675-45756bc5c402", 1200),
  festivalGroup: u("photo-1585904194096-15ef66ccd234", 1200),
  weaverFloor: u("photo-1606681246594-372e9e133ac1", 1200),
  paperArtisan: u("photo-1606681246653-74521ac452f4", 1200),
  muralPainter: u("photo-1606159425081-b0b1a1a2ad53", 1200),
  woodworker: u("photo-1606077089838-0ac4a27fc96f", 1200),
  woodTool: u("photo-1606077089563-cff5a4f3d3d9", 1200),
  carverHands: u("photo-1497219055242-93359eeed651", 1200),

  // Craft & product details
  loomWoman: u("photo-1638310533874-6c124c012e1d", 1200),
  loomSeated: u("photo-1578680152095-d65d3497264b", 1200),
  loomDetail: u("photo-1646750421466-a04e689254d4", 1200),
  loomColour: u("photo-1643766883805-829d9ad95c42", 1200),
  yarnDetail: u("photo-1643766882273-335aae5a9309", 1200),
  textileRGB: u("photo-1592914486106-fa452cfc092c", 1200),
  textileBWR: u("flagged/photo-1582318670203-fd9c151d284c", 1200),
  textileStripe: u("photo-1619239635762-8132f6dba51c", 1200),
  checkedCloth: u("photo-1739173502526-de6efeb0b30c", 1200),
  woodenBowl: u("photo-1558649332-07f21970d309", 1200),
  woodenBowlRound: u("photo-1609688538023-2090aa8e874e", 1200),
  woodenBowlsSet: u("photo-1645205441056-895632a8f5d9", 1200),
  woodenContainer: u("photo-1621157479674-9fd8fa4fbf81", 1200),
  carvedPanel: u("photo-1603789766418-1e992e16f1ab", 1200),
  carvedWall: u("photo-1603789766884-aef036cd3b5a", 1200),
  paintingsDisplay: u("photo-1753541042306-b18fb2c9bffe", 1200),
  paintingOrnate: u("photo-1761394045604-2345ced04d5a", 1200),
  earringsSilver: u("photo-1762762905728-955d8ec09cbb", 1200),
  earringsOrange: u("photo-1758974504606-7536527c36c6", 1200),
  earringsGreen: u("photo-1784746829625-b50da7a9d364", 1200),
  earringsBlue: u("photo-1784746070213-9cdcb634a227", 1200),
  bagStriped: u("photo-1785704440157-ac28234e2010", 1200),
  bagColourful: u("photo-1660695828417-9cc2724bf656", 1200),
  bagsHanging: u("photo-1777283316185-9eff9eac098c", 1200),
  toteWoven: u("photo-1524679813234-66a389fe1a42", 1200),
} as const;

export type MediaKey = keyof typeof media;
