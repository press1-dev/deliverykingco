"use client";

import { useState } from "react";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import { ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  {
    slug: "aegis-legend-2",
    name: "Aegis Legend 2 - Cyber Series",
    brand: "GEEKVAPE",
    price: "64.99",
    image: "/products/productImg-1.jpg",
    tag: "NEW" as const,
  },
  {
    slug: "bc5000-ultra",
    name: "BC5000 Ultra - Strawberry Kiwi",
    brand: "ELFBAR",
    price: "19.99",
    image: "/products/productImg-1.jpg",
    tag: "BESTSELLER" as const,
  },
  {
    slug: "xros-3-nano",
    name: "XROS 3 Nano - Mesh Edition",
    brand: "VAPORESSO",
    price: "32.50",
    image: "/products/productImg-1.jpg",
  },
  {
    slug: "neon-blast-salt",
    name: "Neon Blast Salt - 30ml",
    brand: "NAKED 100",
    price: "14.99",
    image: "/products/productImg-1.jpg",
    tag: "LIMITED" as const,
  },
  {
    slug: "nord-5-pro",
    name: "Nord 5 Pro Pod Kit",
    brand: "SMOK",
    price: "45.00",
    image: "/products/productImg-1.jpg",
  },
  {
    slug: "sakerz-master-tank",
    name: "Sakerz Master Tank",
    brand: "HORIZONTECH",
    price: "38.99",
    image: "/products/productImg-1.jpg",
  },
];

const FILTERS = {
  deviceType: ["Disposable Vapes", "Pod Systems", "Box Mods", "Tanks & RDAs"],
  brands: ["ELFBAR", "SMOK", "GeekVape", "Vaporesso"],
  nicotine: ["0mg", "3mg", "20mg", "50mg"],
};

export default function ShopPage() {
  const [activeNicotine, setActiveNicotine] = useState("20mg");

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Shop Header */}
      <div className="border-b border-white/5 bg-[#080808] py-8">
        <div className="container mx-auto flex flex-col justify-between gap-6 px-6 lg:flex-row lg:items-center lg:px-12">
          <div>
            <h1 className="font-heading text-2xl font-black uppercase tracking-tighter text-white lg:text-3xl">
              Premium Shop
            </h1>
            <p className="mt-1 text-sm text-[#C4C9AC]">
              Showing 1-12 of 124 results for <span className="text-[#CCFF00]">All Categories</span>
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/5 lg:hidden">
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <div className="relative flex items-center gap-3 rounded-lg border border-white/10 px-4 py-2.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sort By:</span>
              <span className="text-xs font-bold text-white">Newest Arrivals</span>
              <ChevronDown size={14} className="text-white/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 space-y-10 lg:block">
            {/* Device Type */}
            <div className="space-y-6">
              <h3 className="font-heading text-xs font-black uppercase tracking-[2.4px] text-white">
                Device Type
              </h3>
              <div className="space-y-4">
                {FILTERS.deviceType.map((type) => (
                  <label key={type} className="flex cursor-pointer items-center gap-3 group">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]" 
                      defaultChecked={type === "Pod Systems"}
                    />
                    <span className="text-sm font-medium text-[#C4C9AC] transition-colors group-hover:text-white">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-6">
              <h3 className="font-heading text-xs font-black uppercase tracking-[2.4px] text-white">
                Top Brands
              </h3>
              <div className="space-y-4">
                {FILTERS.brands.map((brand) => (
                  <label key={brand} className="flex cursor-pointer items-center gap-3 group">
                    <input 
                      type="radio" 
                      name="brand"
                      className="h-4 w-4 border-white/20 bg-transparent checked:bg-[#CCFF00]" 
                    />
                    <span className="text-sm font-medium text-[#C4C9AC] transition-colors group-hover:text-white">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nicotine */}
            <div className="space-y-6">
              <h3 className="font-heading text-xs font-black uppercase tracking-[2.4px] text-white">
                Nicotine (MG)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {FILTERS.nicotine.map((mg) => (
                  <button
                    key={mg}
                    onClick={() => setActiveNicotine(mg)}
                    className={cn(
                      "rounded-lg border py-3 text-xs font-bold transition-all",
                      activeNicotine === mg
                        ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                        : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white"
                    )}
                  >
                    {mg}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-12">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {PRODUCTS.map((product) => (
                <ShopProductCard key={product.slug} {...product} />
              ))}
              {/* Duplicate for visual demo to match 6 items in image */}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-10">
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/5 hover:text-white">
                <ChevronLeft size={18} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#CCFF00] text-[13px] font-bold text-black">
                1
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[13px] font-bold text-white/40 hover:bg-white/5 hover:text-white">
                2
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[13px] font-bold text-white/40 hover:bg-white/5 hover:text-white">
                3
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:bg-white/5 hover:text-white">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
