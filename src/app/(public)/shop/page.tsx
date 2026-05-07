"use client";

import { useState } from "react";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import {
  ShopSkeleton,
  ShopSidebarSkeleton,
} from "@/components/reusable/shop-skeleton";

const NICOTINE_LEVELS = ["0mg", "3mg", "20mg", "50mg"];

export default function ShopPage() {
  const [activeNicotine, setActiveNicotine] = useState("20mg");

  // Fetch Real Data
  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => clientApi.products.list({ first: 29 }),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => clientApi.categories.list(),
  });

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => clientApi.brands.list(),
  });

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Shop Header */}
      <div className="border-b border-white/5 bg-[#080808] py-8">
        <div className="container mx-auto flex flex-col justify-between gap-6 px-6 lg:flex-row lg:items-center lg:px-12">
          <div>
            <h1 className="font-heading text-2xl font-black tracking-tighter text-white uppercase lg:text-3xl">
              Premium Shop
            </h1>
            <p className="mt-1 text-sm text-[#C4C9AC]">
              {productsLoading ? (
                "Fetching latest arrivals..."
              ) : (
                <>
                  Showing 1-{products?.length || 0} of {products?.length || 0}{" "}
                  results for{" "}
                  <span className="text-[#CCFF00]">All Categories</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-white/5 lg:hidden">
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <div className="relative flex items-center gap-3 rounded-lg border border-white/10 px-4 py-2.5">
              <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                Sort By:
              </span>
              <span className="text-xs font-bold text-white">
                Newest Arrivals
              </span>
              <ChevronDown size={14} className="text-white/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 lg:px-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar - Desktop */}
          <aside className="hidden w-64 shrink-0 space-y-10 lg:block">
            {categoriesLoading ? (
              <ShopSidebarSkeleton />
            ) : (
              <>
                {/* Device Type (Categories) */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                    Device Type
                  </h3>
                  <div className="space-y-4">
                    {categories?.map((category) => (
                      <label
                        key={category.entityId}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-white/20 bg-transparent checked:bg-[#CCFF00]"
                        />
                        <span className="text-sm font-medium text-[#C4C9AC] transition-colors group-hover:text-white">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                    Top Brands
                  </h3>
                  <div className="space-y-4">
                    {brands?.slice(0, 8).map((brand) => (
                      <label
                        key={brand.entityId}
                        className="group flex cursor-pointer items-center gap-3"
                      >
                        <input
                          type="radio"
                          name="brand"
                          className="h-4 w-4 border-white/20 bg-transparent checked:bg-[#CCFF00]"
                        />
                        <span className="text-sm font-medium text-[#C4C9AC] transition-colors group-hover:text-white">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nicotine */}
                <div className="space-y-6">
                  <h3 className="font-heading text-xs font-black tracking-[2.4px] text-white uppercase">
                    Nicotine (MG)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {NICOTINE_LEVELS.map((mg) => (
                      <button
                        key={mg}
                        onClick={() => setActiveNicotine(mg)}
                        className={cn(
                          "rounded-lg border py-3 text-xs font-bold transition-all",
                          activeNicotine === mg
                            ? "border-[#CCFF00] bg-[#CCFF00]/10 text-[#CCFF00]"
                            : "border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:text-white",
                        )}
                      >
                        {mg}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-12">
            {productsError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle size={48} className="text-red-500/50" />
                <h3 className="mt-4 text-xl font-bold">
                  Failed to load products
                </h3>
                <p className="mt-2 text-[#C4C9AC]">
                  Please check your connection or try again later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 rounded-lg bg-[#CCFF00] px-6 py-2 text-sm font-bold text-black"
                >
                  Retry
                </button>
              </div>
            ) : productsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <ShopSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products?.map((product) => (
                  <ShopProductCard
                    key={product.entityId}
                    slug={product.path.replace(/^\//, "")}
                    name={product.name}
                    brand={product.brand?.name || "Premium Brand"}
                    price={product.prices?.price.value.toString() || "0.00"}
                    image={
                      product.defaultImage?.url || "/products/productImg-1.jpg"
                    }
                    tag={product.entityId % 5 === 0 ? "NEW" : undefined} // Logic for demo tags
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!productsLoading && !productsError && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
