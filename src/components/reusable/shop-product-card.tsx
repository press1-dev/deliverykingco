"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopProductCardProps {
  slug: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  tag?: "NEW" | "BESTSELLER" | "LIMITED";
}

export function ShopProductCard({
  slug,
  name,
  brand,
  price,
  image,
  tag,
}: ShopProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#121214] transition-all hover:border-[#CCFF00]/20 hover:shadow-2xl hover:shadow-[#CCFF00]/5">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#1A1A1C]">
        {/* Tags */}
        {tag && (
          <div
            className={cn(
              "absolute top-4 left-4 z-10 rounded-sm px-3 py-1 text-[10px] font-black tracking-widest text-black",
              tag === "NEW" && "bg-[#CCFF00]",
              tag === "BESTSELLER" && "bg-[#A020F0] text-white",
              tag === "LIMITED" && "bg-[#FF1493] text-white",
            )}
          >
            {tag}
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black hover:text-[#CCFF00]">
          <Heart size={16} />
        </button>

        <Link href={`/shop/${slug}`} className="relative block h-full w-full">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
            priority={slug === "aegis-legend-2"} // Optimization for likely LCP
          />
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
          {brand}
        </span>
        <Link href={`/shop/${slug}`} className="mt-1">
          <h3 className="font-heading line-clamp-2 min-h-10 text-base font-bold text-[#E4E1E6] transition-colors hover:text-[#CCFF00]">
            {name}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-heading text-lg font-black text-[#CCFF00]">
              ${price}
            </span>
            {/* Optional old price could go here */}
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#CCFF00] text-black transition-all hover:bg-[#b3e600] active:scale-95">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
