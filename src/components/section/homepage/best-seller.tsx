import BestSellerCard from "@/components/reusable/best-seller-card";

export default function BestSellerSection() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
      <BestSellerCard />
      <BestSellerCard />
      <BestSellerCard />
      <BestSellerCard />
      <BestSellerCard />
    </div>
  );
}
