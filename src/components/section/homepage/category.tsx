"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/bigcommerce/api";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="my-10 md:my-16 w-full px-4 md:px-6 max-w-[1600px] mx-auto">
      {/* Heading */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold uppercase text-[#E4E1E6] tracking-tight">
          Browse By Category
        </h2>
        <div className="h-1.5 w-24 md:w-40 bg-[#CCFF00] mt-2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.entityId}
            href={`/category${cat.path}`}
            className="group relative overflow-hidden rounded-xl bg-[#111111] aspect-[4/5]"
          >
            {/* Image */}
            {cat.image?.url ? (
              <Image
                src={cat.image.url}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-[#222222] flex items-center justify-center">
                <span className="text-gray-500 font-bold uppercase tracking-widest">
                  {cat.name}
                </span>
              </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 p-5">
              <h3 className="text-white text-lg md:text-xl font-bold uppercase tracking-tight">
                {cat.name}
              </h3>
              <p className="text-[#CCFF00] text-xs font-semibold mt-1 tracking-wider">
                SHOP NOW →
              </p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#CCFF00]/40 rounded-xl transition-all duration-300" />
          </Link>
        ))}
      </div>
    </section>
  );
}
