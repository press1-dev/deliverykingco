"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopProductCard } from "@/components/reusable/shop-product-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const RECOMMENDED_PRODUCTS = [
  {
    slug: "bc5000-ultra",
    name: "BC5000 Ultra - Strawberry Kiwi",
    brand: "ELFBAR",
    price: "19.99",
    image: "/products/productImg-1.jpg",
    tag: "BESTSELLER" as const,
  },
  {
    slug: "xros-3-nano",
    name: "XROS 3 Nano - Mesh Edition",
    brand: "VAPORESSO",
    price: "32.50",
    image: "/products/productImg-1.jpg",
  },
  {
    slug: "neon-blast-salt",
    name: "Neon Blast Salt - 30ml",
    brand: "NAKED 100",
    price: "14.99",
    image: "/products/productImg-1.jpg",
    tag: "LIMITED" as const,
  },
];

export default function ProductDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeColor, setActiveColor] = useState("lime");
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const productName = slug.replace(/-/g, " ").toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6 lg:px-12">
        <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="transition-colors hover:text-white">
            Vape Kits
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#CCFF00]">{productName}</span>
        </nav>
      </div>

      <main className="container mx-auto px-6 pb-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Product Gallery */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-4 md:flex-col">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumbnail(i)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
                    activeThumbnail === i
                      ? "border-[#CCFF00]"
                      : "border-white/5 hover:border-white/20",
                  )}
                >
                  <Image
                    src="/products/productImg-1.jpg"
                    alt={`Thumbnail ${i}`}
                    fill
                    className="object-contain p-2"
                  />
                  {i === 2 && (
                    <div className="font-heading absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold">
                      3
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A]">
              <Image
                src="/products/productImg-1.jpg"
                alt={productName}
                fill
                className="object-contain p-12"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-[3.6px] text-[#CCFF00] uppercase">
                Signature Series
              </span>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-white uppercase lg:text-5xl">
                {productName}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-[#CCFF00] text-[#CCFF00]"
                    />
                  ))}
                  <Star size={14} className="text-white/20" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  128 Reviews
                </span>
                <div className="h-4 w-px bg-white/10" />
                <span className="rounded-sm bg-[#CCFF00]/10 px-2 py-1 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase">
                  In Stock
                </span>
              </div>
            </div>

            <p className="font-body max-w-lg text-base leading-relaxed text-[#C4C9AC]">
              The pinnacle of performance. Featuring the proprietary
              Nexus-Chipset, the {productName} delivers instantaneous firing
              speed and adaptive wattage control for the ultimate flavor
              profile.
            </p>

            <div className="flex items-baseline gap-4">
              <span className="font-heading text-3xl font-black text-[#CCFF00]">
                $120.99
              </span>
              <span className="text-lg text-white/20 line-through">
                $159.99
              </span>
            </div>

            {/* Variant Selectors */}
            <div className="space-y-6 pt-4">
              <div className="flex gap-4">
                {["lime", "blue", "purple"].map((color) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 p-1 transition-all",
                      activeColor === color
                        ? "border-[#CCFF00]"
                        : "border-transparent",
                    )}
                  >
                    <div
                      className={cn(
                        "h-full w-full rounded-full",
                        color === "lime" &&
                          "bg-linear-to-tr from-[#CCFF00] to-[#88AA00]",
                        color === "blue" &&
                          "bg-linear-to-tr from-[#00A3FF] to-[#0055AA]",
                        color === "purple" &&
                          "bg-linear-to-tr from-[#A020F0] to-[#5500AA]",
                      )}
                    />
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  Select Flavor:{" "}
                  <span className="text-white">Nexus Mint Blast</span>
                </span>
                <div className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#CCFF00] uppercase">
                      Nexus Mint
                    </span>
                    <span className="text-xs text-white/40">Cool Menthol</span>
                  </div>
                  <ChevronRight size={16} className="rotate-90 text-white/20" />
                </div>
              </div>
            </div>

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-4">
                <div className="flex items-center gap-6 rounded-lg border border-white/10 bg-white/5 px-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-white/40 hover:text-white"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-heading min-w-6 text-center text-lg font-bold">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-white/40 hover:text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className="font-heading flex-1 rounded-lg bg-[#CCFF00] py-4 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-[#b3e600] active:scale-95">
                  Add To Cart
                </button>
              </div>
              <button className="font-heading w-full rounded-lg border border-[#CCFF00] py-4 text-xs font-black tracking-widest text-[#CCFF00] uppercase transition-all hover:bg-[#CCFF00]/5">
                Quick Buy With Apple Pay
              </button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-8 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-[#CCFF00]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    2-Year Warranty
                  </span>
                  <span className="text-[9px] text-white/40 uppercase">
                    Global covers included
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-[#CCFF00]" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Fast Shipping
                  </span>
                  <span className="text-[9px] text-white/40 uppercase">
                    Same day dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-32 space-y-12">
          <div className="flex border-b border-white/10">
            <button className="border-b-2 border-[#CCFF00] pr-12 pb-4 text-sm font-bold tracking-widest uppercase">
              Description
            </button>
            <button className="pr-12 pb-4 text-sm font-bold tracking-widest text-white/20 uppercase hover:text-white/40">
              Specifications
            </button>
            <button className="pb-4 text-sm font-bold tracking-widest text-white/20 uppercase hover:text-white/40">
              Reviews (128)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-black tracking-tighter uppercase">
                Beyond the Clouds
              </h2>
              <p className="font-body text-lg leading-relaxed text-[#C4C9AC]">
                The {productName} isn&apos;t just a device; it&apos;s a
                statement of engineering excellence. Designed for those who
                refuse to compromise, every component has been refined to
                provide the smoothest draw and most intense flavor experience
                imaginable.
              </p>
              <div className="space-y-4 pt-6">
                {[
                  "Dual-Mesh Coil Technology",
                  "Instant Firing Speed (0.001s)",
                  "Aerospace-Grade Titanium Chassis",
                  "Intelligent Wattage Memory",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#CCFF00]/10">
                      <Check size={12} className="text-[#CCFF00]" />
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <p className="font-body text-white/20 italic">
                Action / Feature Image Placeholder
              </p>
            </div>
          </div>
        </div>

        {/* Recommendation Items */}
        <div className="mt-40 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-black tracking-tighter uppercase lg:text-3xl">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-xs font-bold tracking-widest text-[#CCFF00] uppercase hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED_PRODUCTS.map((product) => (
              <ShopProductCard key={product.slug} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
