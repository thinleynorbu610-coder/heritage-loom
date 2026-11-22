"use client";

import { Hero } from "@/components/home/Hero";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();

  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturedCategories />
      {user && <FeaturedProducts />}
      <StoryBehindCraft />
      {user && <ArtisanSpotlight />}
      <RegionExplorer />
      <Testimonials />
      <TraditionMeetsTomorrow />
      <SellerCallout />
    </>
  );
}
