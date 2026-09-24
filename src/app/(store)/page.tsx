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
import { Testimonials } from "@/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <StoryBehindCraft />
      <ArtisanSpotlight />
      <RegionExplorer />
      <Testimonials />
      <TraditionMeetsTomorrow />
      <SellerCallout />
    </>
  );
}
