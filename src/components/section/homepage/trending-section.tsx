"use client";

import { useProducts } from "@/features/products/use-products";
import { TrendingCard } from "@/components/reusable/trending-card";
import { ShopSkeleton } from "@/components/reusable/shop-skeleton";

export const TrendingSection = () => {
  const { data: products, isLoading, isError } = useProducts({ first: 5 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <ShopSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !products) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <TrendingCard key={product.entityId} product={product} />
      ))}
    </div>
  );
};
