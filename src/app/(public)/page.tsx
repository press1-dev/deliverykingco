"use client";

import { useRef } from "react";
import BestSellerSection, { ScrollController as BestSellerController } from "@/components/section/homepage/best-seller";
import CategorySection, { ScrollController as CategoryController } from "@/components/section/homepage/category";
import { HeroSection } from "@/components/section/homepage/hero";
import { NewArrivalSection } from "@/components/section/homepage/new-arrivals";
import BrandSection from "@/components/section/homepage/brand-section";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TrendingSection, ScrollController as TrendingController } from "@/components/section/homepage/trending-section";
import { VerifiedReviews } from "@/components/section/homepage/verified-reviews";

export default function Home() {
  const bestSellerRef = useRef<BestSellerController>(null);
  const trendingRef = useRef<TrendingController>(null);
  const categoryRef = useRef<CategoryController>(null);

  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />

      {/* Category Slider Section */}
      <div className="w-full px-8 py-20">
        {/* Top Sections */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase lg:text-5xl">
              Browse By Category
            </h2>
            <p className="text-xs text-white/40 lg:text-lg">
              Explore our range of premium products by category.
            </p>
          </div>
          {/* buttons */}
          <div className="flex items-center gap-x-4">
            <button 
              onClick={() => categoryRef.current?.scrollLeft()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5" />
            </button>
            <button 
              onClick={() => categoryRef.current?.scrollRight()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5 rotate-180" />
            </button>
          </div>
        </div>

        {/* Categories Row */}
        <div className="w-full">
          <CategorySection ref={categoryRef} />
        </div>
      </div>

      {/* Best Seller Section */}
      <div className="w-full px-8 py-20">
        {/* Top Sections */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase lg:text-5xl">
              Best Sellers
            </h2>
            <p className="text-xs text-white/40 lg:text-lg">
              The products our community keeps coming back for.
            </p>
          </div>
          {/* buttons */}
          <div className="flex items-center gap-x-4">
            <button 
              onClick={() => bestSellerRef.current?.scrollLeft()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5" />
            </button>
            <button 
              onClick={() => bestSellerRef.current?.scrollRight()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5 rotate-180" />
            </button>
          </div>
        </div>

        {/* Products Row */}
        <div className="w-full">
          <BestSellerSection ref={bestSellerRef} />
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="w-full px-8 py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase lg:text-5xl">
              New Arrivals
            </h2>
            <div className="mt-2 h-1.5 w-1/2 bg-[#CCFF00]" />
          </div>
          {/* buttons */}
          <div className="flex items-center gap-x-4">
            <Link href={"/shop"} className="cursor-pointer">
              <span className="border-b border-[#CCFF00] text-sm font-bold text-[#CCFF00]">
                View All Drops &rarr;
              </span>
            </Link>
          </div>
        </div>
        {/* Product Sections */}
        <NewArrivalSection />
      </div>

      {/* Brand Section */}
      <BrandSection />

      {/* Trending Now Section */}
      <div className="w-full px-8 py-20">
        {/* heading and button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase lg:text-5xl">
              Trending Now
            </h2>
            <p className="text-xs text-white/40 lg:text-lg">
              The most searched items on site this week.
            </p>
          </div>
          {/* buttons */}
          <div className="flex items-center gap-x-4">
            <button 
              onClick={() => trendingRef.current?.scrollLeft()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5" />
            </button>
            <button 
              onClick={() => trendingRef.current?.scrollRight()}
              className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50 active:scale-[0.95]"
            >
              <ArrowLeft className="h-5.5 w-5.5 rotate-180" />
            </button>
          </div>
        </div>
        {/* product cards row */}
        <TrendingSection ref={trendingRef} />
      </div>

      {/* Verified Reviews Sections */}
      <div className="w-full px-8 py-20">
        {/* Top Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold uppercase lg:text-5xl">
            Verified Reviews
          </h1>
          <p className="text-sm text-[#C4C9AC]">
            What our community of vapers has to say about the Nexus experience.
          </p>
        </div>

        {/* Reviews Container */}
        <div>
          <VerifiedReviews />
        </div>
      </div>
    </main>
  );
}
