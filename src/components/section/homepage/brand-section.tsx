"use client";

import Link from "next/link";
import { useBrands } from "@/features/brands/use-brands";

export default function BrandSection() {
  const { data: brands, isLoading, isError } = useBrands();

  if (isLoading) {
    return (
      <section className="bg-[#050505] py-12 md:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-10 h-3 w-32 animate-pulse rounded bg-[#222222]" />
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 md:gap-x-16">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-24 animate-pulse rounded bg-[#111111]"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !brands || brands.length === 0) return null;

  return (
    <section className="group relative border-y border-white/5 bg-[#050505] py-12 transition-colors duration-500 hover:bg-[#080808] md:py-16">
      <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
        <div className="flex flex-col items-center">
          {/* Section Header */}
          <h2 className="z-10 mb-10 text-center text-lg font-medium tracking-widest text-white/80 uppercase transition-colors duration-300 group-hover:text-white">
            Shop by Brand
          </h2>

          {/* Marquee Wrapper with Faded Edges */}
          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_15%,black_85%,transparent_100%)]">
            <div
              className="animate-infinite-scroll flex w-fit items-center gap-x-12 py-4 will-change-transform md:gap-x-20"
              aria-label="Brand marquee"
            >
              {/* Render items twice for seamless looping */}
              {[...brands, ...brands].map((brand, index) => (
                <Link
                  key={`${brand.entityId}-${index}`}
                  href={`/brand${brand.path}`}
                  className="group/item relative shrink-0"
                >
                  <span className="text-[14px] font-bold tracking-widest text-[#E4E1E6] uppercase transition-all duration-300 group-hover/item:text-white md:text-[18px]">
                    {brand.name}
                  </span>
                  {/* Premium indicator underline */}
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.5)] transition-all duration-300 group-hover/item:w-full" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 35s linear infinite;
        }

        /* Hover state on the section (group) pauses the animation */
        .group:hover .animate-infinite-scroll {
          animation-play-state: paused;
        }

        /* Senior Dev Touch: Respect user motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-infinite-scroll {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
