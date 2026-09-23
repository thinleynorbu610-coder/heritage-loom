import { Hero } from "@/components/home/Hero";
import {
  ArtisanSpotlight,
  FeaturedCategories,
  FeaturedProducts,
  SellerCallout,
  StoryBehindCraft,
  TraditionMeetsTomorrow,
  TrustSection,
} from "@/components/home/HomeSections";
import { RegionExplorer } from "@/components/home/RegionExplorer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <StoryBehindCraft />
      <ArtisanSpotlight />
      <RegionExplorer />
      <TraditionMeetsTomorrow />
      <TrustSection />
      <SellerCallout />
    </>
  );
}
