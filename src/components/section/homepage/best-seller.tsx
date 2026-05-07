"use client";

import { useProducts } from "@/features/products/use-products";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import { ShopSkeleton } from "@/components/reusable/shop-skeleton";

export default function BestSellerSection() {
  const { data: products, isLoading, isError } = useProducts({ first: 5 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <ShopSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !products) return null;

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ShopProductCard
          key={product.entityId}
          slug={product.path.replace(/^\//, '')}
          name={product.name}
          brand={product.brand?.name || "Premium Brand"}
          price={product.prices?.price.value.toString() || "0.00"}
          image={product.defaultImage?.url || "/products/productImg-1.jpg"}
          tag="BESTSELLER"
        />
      ))}
    </div>
  );
}
