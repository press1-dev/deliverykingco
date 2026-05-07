import { TrendingCard } from "@/components/reusable/trending-card";

export const TrendingSection = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      <TrendingCard />
      <TrendingCard />
      <TrendingCard />
      <TrendingCard />
      <TrendingCard />
    </div>
  );
};
