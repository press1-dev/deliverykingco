import ProductCard from "@/components/reusable/product-card";

export default function BestSellerSection() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
}
