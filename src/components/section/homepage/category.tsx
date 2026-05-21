"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/features/categories/use-categories";

export interface ScrollController {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const CategorySection = forwardRef<ScrollController>((props, ref) => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

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
          <div
            key={i}
            className="w-[280px] shrink-0 aspect-4/5 animate-pulse rounded-xl bg-[#111111]"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center py-10">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Failed to load categories
        </h2>
        <p className="mb-6 text-gray-400">{error?.message}</p>
        <button
          onClick={() => refetch()}
          className="rounded-full bg-[#CCFF00] px-6 py-2 font-bold tracking-widest text-black uppercase transition hover:bg-[#b3e600]"
        >
          Retry
        </button>
      </div>
    );
  }

  const homeCategories = categories || [];

  if (homeCategories.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none pb-4 snap-x snap-mandatory"
    >
      {homeCategories.map((cat) => (
        <div key={cat.entityId} className="w-[280px] shrink-0 snap-start">
          <Link
            href={`/shop?category=${cat.entityId}`}
            className="group relative aspect-4/5 block w-full overflow-hidden rounded-xl bg-[#111111]"
          >
            {/* Image */}
            {cat.image?.url ? (
              <Image
                src={cat.image.url}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#222222]">
                <span className="font-bold tracking-widest text-gray-500 uppercase text-center px-4">
                  {cat.name}
                </span>
              </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/60" />

            {/* Content */}
            <div className="absolute bottom-0 p-5 w-full">
              <h3 className="text-lg font-bold tracking-tight text-white uppercase md:text-xl">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs font-semibold tracking-wider text-[#CCFF00]">
                SHOP NOW →
              </p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-xl border border-transparent transition-all duration-300 group-hover:border-[#CCFF00]/40" />
          </Link>
        </div>
      ))}
    </div>
  );
});

CategorySection.displayName = "CategorySection";
export default CategorySection;
