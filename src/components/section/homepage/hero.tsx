import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-black @container lg:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute h-[1200px] inset-0 z-0">
        <Image
          src="/images/hero-image.png"
          alt="Next Generation Vape"
          height={1200}
          width={1920}
          className="h-auto w-full object-cover"
          priority
        />
        {/* Uniform Overlay Tint */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-8 lg:px-12 animate-fadeIn">
        <div className="max-w-3xl">
          {/* Tagline */}
          <p className="mb-2 text-heading text-[14px] font-bold uppercase tracking-[4.2px] text-[#CCFF00] ">
            Engineered for Excellence
          </p>

          {/* Main Heading */}
          <h1 className="mb-4 flex flex-col font-heading text-4xl lg:text-7xl font-bold leading-[1.05] tracking-[-2.88px] text-[#E4E1E6] ">
            <span>THE NEXT</span>
            <span className="flex flex-wrap items-center gap-x-3">
              <span className="text-[#CCFF00]">GENERATION</span>
              <span>OF</span>
            </span>
            <span>VAPE</span>
          </h1>

          {/* Subtext */}
          <p className="mb-6 max-w-lg text-base leading-relaxed text-zinc-300 font-body font-regular ">
            Premium devices, artisanal e-liquids, and cutting-edge tech.
            Experience the nexus of flavor and performance with Colorado&apos;s #1 delivery service.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="small"
                className="w-full bg-[#CCFF00] px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-[#b3e600] border-none"
              >
                Shop All Products
              </Button>
            </Link>
            
            <Link href="/brands" className="w-full sm:w-auto">
              <Button
                size="small"
                variant="secondary"
                className="w-full border-neutral-700 bg-black/40 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm hover:bg-neutral-900"
              >
                Explore Brands
              </Button>
            </Link>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Shadow */}
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
