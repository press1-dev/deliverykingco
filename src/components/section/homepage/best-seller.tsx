"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useProducts } from "@/features/products/use-products";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import { ShopSkeleton } from "@/components/reusable/shop-skeleton";

export interface ScrollController {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const BestSellerSection = forwardRef<ScrollController>((props, ref) => {
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
      {products.map((product, index) => (
        <div key={product.entityId} className="w-[280px] shrink-0 snap-start">
          <ShopProductCard
            slug={product.path.replace(/^\//, "")}
            name={product.name}
            brand={product.brand?.name || "Premium Brand"}
            price={product.prices?.price.value.toString() || "0.00"}
            image={product.defaultImage?.url || "/products/productImg-1.jpg"}
            tag="BESTSELLER"
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
});

BestSellerSection.displayName = "BestSellerSection";
export default BestSellerSection;
