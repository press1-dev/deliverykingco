"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useProducts } from "@/features/products/use-products";
import { TrendingCard } from "@/components/reusable/trending-card";
import { ShopSkeleton } from "@/components/reusable/shop-skeleton";

export interface ScrollController {
  scrollLeft: () => void;
  scrollRight: () => void;
}

export const TrendingSection = forwardRef<ScrollController>((props, ref) => {
  // Query 10 items to provide a premium scrollable selection
  const { data: products, isLoading, isError } = useProducts({ first: 10 });
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -320, behavior: "smooth" });
      }
    },
    scrollRight: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: 320, behavior: "smooth" });
      }
    }
  }));

  if (isLoading) {
    return (
      <div className="flex gap-6 overflow-x-hidden pb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-[280px] shrink-0">
            <ShopSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !products) return null;

  return (
    <div 
      ref={containerRef}
      className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none pb-4 snap-x snap-mandatory"
    >
      {products.map((product) => (
        <div key={product.entityId} className="w-[280px] shrink-0 snap-start">
          <TrendingCard product={product} />
        </div>
      ))}
    </div>
  );
});

TrendingSection.displayName = "TrendingSection";
