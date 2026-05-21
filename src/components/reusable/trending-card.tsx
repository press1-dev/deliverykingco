import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/lib/bigcommerce/api";

interface TrendingCardProps {
  product?: Product;
}

/**
 * TrendingCard Component
 *
 * A premium product card design optimized for "Trending Now" sections.
 * Features a vertical aspect ratio, neon accents, and a moody aesthetic.
 *
 * @author Senior Frontend Engineer & Designer
 */
export const TrendingCard = ({ product }: TrendingCardProps) => {
  // Graceful fallback for demo/development purposes
  const name = product?.name || "TITAN V3 MOD";
  const price = product?.prices?.price?.value
    ? `$${product.prices.price.value.toFixed(2)}`
    : "$89.00";

  // Using a placeholder that matches the moody vibe of the reference image
  const imageUrl = product?.defaultImage?.url || "/products/productImg-1.jpg";

  const slug = product?.path ? product.path.replace(/^\//, "") : "";
  const href = slug ? `/shop/${slug}` : "#";

  return (
    <div className="group relative flex flex-col gap-y-5 rounded-[4px] border border-white/5 bg-[#1B1B1E] p-3 transition-all duration-500 hover:border-[#CCFF00]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      {/* Stretched Link to cover the entire card for seamless navigation */}
      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${name}`}
      />

      {/* "HOT" Badge - Precision aligned with neon styling */}
      <div className="absolute top-5 right-5 z-20 rounded-full bg-[#CCFF00] px-3 py-1.5 text-[9px] font-black tracking-widest text-black uppercase shadow-[0_0_15px_rgba(204,255,0,0.3)]">
        Hot
      </div>

      {/* Image Container - Vertical 4:5 Aspect Ratio */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2px] bg-[#0A0A0A]">
        <div className="relative block h-full w-full">
          {/* Main Product Image with subtle zoom on hover */}
          <div className="relative h-full w-full p-4 transition-transform duration-700 ease-out group-hover:scale-110">
            <Image
              src={imageUrl}
              fill
              alt={name}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Floor Reflection / Gradient Mask for that "studio" look */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />

        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05)_0%,transparent_70%)]" />
        </div>
      </div>

      {/* Content Section - Precision typography */}
      <div className="flex items-end justify-between px-1 pb-1">
        <div className="flex flex-col gap-y-1">
          <h3 className="max-w-[140px] truncate text-sm font-bold tracking-wider text-[#E4E1E6] uppercase transition-colors duration-300 group-hover:text-[#CCFF00] md:text-base">
            {name}
          </h3>
          <p className="text-lg font-bold tracking-tight text-[#CCFF00] md:text-xl">
            {price}
          </p>
        </div>

        {/* Interactive Cart Action */}
        <button
          className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2D] text-white/60 transition-all duration-300 hover:scale-110 hover:bg-[#CCFF00] hover:text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] active:scale-95"
          title="Add to Cart"
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Decorative Border Glow on Hover */}
      <div className="absolute inset-0 -z-10 rounded-[4px] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-px rounded-[3px] border border-[#CCFF00]/10" />
      </div>
    </div>
  );
};
