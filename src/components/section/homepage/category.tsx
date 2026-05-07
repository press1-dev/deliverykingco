"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/features/categories/use-categories";

export default function CategorySection() {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useCategories();

  if (isLoading) {
    return (
      <section className="mx-auto my-10 w-full max-w-[1600px] px-4 md:my-16 md:px-6">
        <div className="mb-8 md:mb-12">
          <div className="h-10 w-64 animate-pulse rounded bg-[#222222]" />
          <div className="mt-2 h-1.5 w-24 bg-[#CCFF00] md:w-40" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-4/5 animate-pulse rounded-xl bg-[#111111]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto my-10 w-full max-w-[1600px] px-4 text-center md:my-16 md:px-6">
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
      </section>
    );
  }

  const homeCategories = categories?.slice(0, 12) || [];

  if (homeCategories.length === 0) return null;

  return (
    <section className="mx-auto my-10 w-full max-w-[1600px] px-4 md:my-16 md:px-6">
      {/* Heading */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-[#E4E1E6] uppercase md:text-[48px]">
          Browse By Category
        </h2>
        <div className="mt-2 h-1.5 w-24 bg-[#CCFF00] md:w-40" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {homeCategories.map((cat) => (
          <Link
            key={cat.entityId}
            href={`/category${cat.path}`}
            className="group relative aspect-4/5 overflow-hidden rounded-xl bg-[#111111]"
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
                <span className="font-bold tracking-widest text-gray-500 uppercase">
                  {cat.name}
                </span>
              </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 transition duration-300 group-hover:bg-black/60" />

            {/* Content */}
            <div className="absolute bottom-0 p-5">
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
        ))}
      </div>
    </section>
  );
}
