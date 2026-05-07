import BestSellerSection from "@/components/section/homepage/best-seller";
import CategorySection from "@/components/section/homepage/category";
import { HeroSection } from "@/components/section/homepage/hero";
import { NewArrivalSection } from "@/components/section/homepage/new-arrivals";
import BrandSection from "@/components/section/homepage/brand-section";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TrendingSection } from "@/components/section/homepage/trending-section";
export default function Home() {
  return (
    <main>
      <HeroSection />

      <CategorySection />

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
            <button className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50">
              <ArrowLeft className="h-5.5 w-5.5" />
            </button>
            <button className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50">
              <ArrowLeft className="h-5.5 w-5.5 rotate-180" />
            </button>
          </div>
        </div>

        {/* Proucts */}
        <div className="w-full">
          <BestSellerSection />
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
            <button className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50">
              <ArrowLeft className="h-5.5 w-5.5" />
            </button>
            <button className="cursor-pointer rounded-lg border border-[#CCFF00]/15 bg-[#2A2A2D] p-3 transition-colors duration-300 hover:border-green-500/50">
              <ArrowLeft className="h-5.5 w-5.5 rotate-180" />
            </button>
          </div>
        </div>
        {/* product cards */}
        <TrendingSection />
      </div>
    </main>
  );
}
