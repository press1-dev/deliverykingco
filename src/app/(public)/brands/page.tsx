"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { Product } from "@/lib/bigcommerce/api";
import { useMemo, useState, useEffect } from "react";

// High-fidelity structured brand designs mapping for the REAL brands in the store database
const FEATURED_BRANDS_MAP: Record<string, { logo: React.ReactNode; description: string }> = {
  "geek bar": {
    description: "Industry-leading disposable devices featuring smart display screens, high puff capacities, and dual-mesh heating elements.",
    logo: (
      <svg className="w-24 h-10" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="12" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="900" letterSpacing="2">GEEK BAR</text>
        <line x1="20" y1="22" x2="80" y2="22" stroke="#CCFF00" strokeWidth="2" />
      </svg>
    )
  },
  "foger": {
    description: "Innovative vapes and premium closed pod systems designed with advanced mesh coil heating technology for extremely consistent flavor.",
    logo: (
      <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" letterSpacing="3">FOGER</text>
      </svg>
    )
  },
  "pacha": {
    description: "Award-winning premium e-liquids and nicotine salts packed with luscious, exotic, and ultra-crisp tropical fruit combinations.",
    logo: (
      <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" letterSpacing="4">PACHA</text>
      </svg>
    )
  },
  "juice head": {
    description: "Globally acclaimed fresh-fruit flavor profiles offering crisp, refreshing, and clean e-juice formulations with a sweet throat hit.",
    logo: (
      <svg className="w-24 h-10" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="10" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" letterSpacing="2">JUICE</text>
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="#CCFF00" fontSize="10" fontWeight="900" letterSpacing="2">HEAD</text>
      </svg>
    )
  },
  "vaporesso": {
    description: "Renowned for the highly advanced AXON chip technology and industry-leading sleek design aesthetics in rechargeable pod mods.",
    logo: (
      <svg className="w-24 h-12" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L62 25 L38 25 Z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <circle cx="50" cy="20" r="12" stroke="white" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <text x="50%" y="36" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="9" fontWeight="900" letterSpacing="1.5">VAPORESSO</text>
      </svg>
    )
  },
  "vuse": {
    description: "Sleek, highly ergonomic magnetic pod systems and smooth vapor flavors crafted for simple, everyday active lifestyles.",
    logo: (
      <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" letterSpacing="4">VUSE</text>
      </svg>
    )
  },
  "juul": {
    description: "The iconic, incredibly pocket-friendly pioneer of modern salt nicotine technology and sleek, minimalist plug-and-play pod systems.",
    logo: (
      <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" letterSpacing="2">JUUL</text>
      </svg>
    )
  },
  "zyn": {
    description: "Premium, 100% tobacco-free food-grade nicotine pouches delivering clean, flavor-packed, smoke-free enjoyment anywhere.",
    logo: (
      <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" letterSpacing="4">ZYN</text>
      </svg>
    )
  },
  "coastal clouds": {
    description: "West-coast inspired premium e-liquids featuring highly popular bold fruit, rich dessert, and cooling menthol blends.",
    logo: (
      <svg className="w-24 h-10" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="10" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" letterSpacing="1.5">COASTAL</text>
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" letterSpacing="1.5">CLOUDS</text>
      </svg>
    )
  },
  "lost mary": {
    description: "Ultra-compact, highly reliable rechargeable disposable vapes featuring unmatched, intense flavor profiles and mesh vapor clouds.",
    logo: (
      <svg className="w-24 h-10" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="50%" y="10" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" letterSpacing="1.5">LOST</text>
        <text x="50%" y="22" dominantBaseline="middle" textAnchor="middle" fill="#CCFF00" fontSize="10" fontWeight="900" letterSpacing="1.5">MARY</text>
      </svg>
    )
  }
};

export default function BrandsPage() {
  const { data: realBrands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: () => clientApi.brands.list(),
  });

  // Fetch real database products list to dynamically populate spotlight card
  const { data: products } = useQuery({
    queryKey: ["products-spotlight"],
    queryFn: () => clientApi.products.list({ first: 250 }),
  });

  // Dynamically select a real, live product for the spotlight card
  const spotlightProduct = useMemo(() => {
    if (!products || products.length === 0) return null;

    // Attempt to find a Vaporesso brand product first as it exists in store database
    const featuredItem = products.find(
      (p) =>
        p.brand?.name?.toLowerCase() === "vaporesso" ||
        p.name?.toLowerCase().includes("vaporesso")
    );

    // Graceful fallback to first store product if no Vaporesso item exists
    return featuredItem || products[0];
  }, [products]);

  // Clean raw HTML or tags from the spotlight description dynamically
  const spotlightDescription = useMemo(() => {
    if (!spotlightProduct) return "Discover next-level performance and design from the masters of vaping technology.";
    if (!spotlightProduct.description) return spotlightProduct.name;

    // Strip tags and slice cleanly
    const textOnly = spotlightProduct.description.replace(/<[^>]*>/g, "");
    return textOnly.length > 90 ? `${textOnly.slice(0, 90)}...` : textOnly;
  }, [spotlightProduct]);

  // State & Effect for the Animated Random Product Loop (excluding the main spotlight product)
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [currentRandomIndex, setCurrentRandomIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter((p) => p.entityId !== spotlightProduct?.entityId);
      if (filtered.length > 0) {
        // Shuffle to get a random starting list
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setRandomProducts(shuffled);
      } else {
        setRandomProducts(products);
      }
    }
  }, [products, spotlightProduct]);

  useEffect(() => {
    if (randomProducts.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentRandomIndex((prev) => (prev + 1) % randomProducts.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [randomProducts]);

  const activeProduct = randomProducts[currentRandomIndex] || null;

  const activeProductDescription = useMemo(() => {
    if (!activeProduct) return "Discover next-level performance and flavor from our curated collections.";
    if (!activeProduct.description) return activeProduct.name;

    const textOnly = activeProduct.description.replace(/<[^>]*>/g, "");
    return textOnly.length > 90 ? `${textOnly.slice(0, 90)}...` : textOnly;
  }, [activeProduct]);

  // Dynamically merge real database brands with custom design assets and fallback placeholders
  const processedBrands = useMemo(() => {
    if (!realBrands || realBrands.length === 0) {
      return [];
    }

    return realBrands.map((rb) => {
      const normalizedName = rb.name.toLowerCase().trim();
      const customAsset = FEATURED_BRANDS_MAP[normalizedName];

      // If the brand has a real image logo uploaded to the database, use it!
      const logoElement = rb.defaultImage?.url ? (
        <div className="relative w-full h-full">
          <Image
            src={rb.defaultImage.url}
            alt={rb.defaultImage.altText || rb.name}
            fill
            sizes="(max-width: 300px) 100vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : customAsset ? (
        customAsset.logo
      ) : (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="h-10 w-10 rounded-full border border-[#CCFF00]/30 bg-[#CCFF00]/5 flex items-center justify-center">
            <span className="text-sm font-black text-[#CCFF00]">{rb.name.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">{rb.name}</span>
        </div>
      );

      const descriptionText = customAsset
        ? customAsset.description
        : rb.name.toLowerCase().includes("pouches") || rb.name.toLowerCase() === "zyn"
          ? `Explore clean, tobacco-free nicotine pouches and smoke-free enjoyment products by ${rb.name}.`
          : `Explore premium hardware, pods, and custom vaping accessories crafted by ${rb.name}.`;

      return {
        entityId: rb.entityId,
        name: rb.name,
        description: descriptionText,
        logo: logoElement,
        shopLink: `/shop?brand=${rb.entityId}`
      };
    });
  }, [realBrands]);

  return (
    <div className="min-h-screen bg-black text-white pb-24 selection:bg-[#CCFF00] selection:text-black">
      {/* Smoke Top Header Section */}
      <section className="relative pt-24 pb-16 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Radial Dark Glow Overlay representing smoke */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.03)_0%,rgba(0,0,0,0)_70%)]" />

        {/* Decorative Smoke Shape SVGs in background */}
        <div className="absolute top-0 w-full h-full opacity-10 pointer-events-none mix-blend-screen">
          <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 300 C400 100 600 400 800 200 C1000 50 1200 300 1440 150" stroke="url(#smoke-grad)" strokeWidth="40" strokeLinecap="round" filter="blur(20px)" />
            <defs>
              <linearGradient id="smoke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CCFF00" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-3xl">



          <h1 className="text-3xl font-black tracking-tighter uppercase sm:text-4xl md:text-5xl lg:text-6xl text-white">
            EXPLORE THE LEADING NAMES IN VAPING
          </h1>

          <p className="mt-6 text-sm text-[#C4C9AC] leading-relaxed max-w-2xl mx-auto">
            Explore our curated collection of industry-leading hardware. From high-performance mods to sleek pod systems, find your perfect match from the world&apos;s most trusted manufacturers.
          </p>
        </div>
      </section>

      {/* Grid of Brand Cards */}
      <section className="container mx-auto px-6 max-w-[1200px] mt-8">
        {isLoading ? (
          /* Pulse Skeleton Grid to avoid Layout Shifts */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/5 bg-[#0D0D0D] p-6 flex flex-col justify-between h-[360px]"
              >
                <div>
                  <div className="w-full aspect-video rounded-xl bg-white/5 mb-6" />
                  <div className="h-4 w-1/3 bg-white/10 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-white/5 rounded" />
                    <div className="h-3 w-5/6 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="h-12 w-full bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedBrands.map((brand, i) => (
              <div
                key={brand.entityId || i}
                className="group relative rounded-2xl border border-white/5 bg-[#0D0D0D] p-6 transition-all duration-300 hover:border-white/10 hover:bg-[#111111] flex flex-col justify-between"
              >
                <div>
                  {/* High-contrast centered brand logo container */}
                  <div className="relative w-full aspect-video rounded-xl bg-white border border-white/5 flex items-center justify-center mb-6 group-hover:border-white/15 transition-all overflow-hidden">
                    <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105 flex items-center justify-center">
                      {brand.logo}
                    </div>
                  </div>

                  <h3 className="text-base font-black tracking-wider text-white uppercase mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-[#C4C9AC] leading-relaxed mb-6">
                    {brand.description}
                  </p>
                </div>

                <Link
                  href={brand.shopLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-3 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98]"
                >
                  Shop Now
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Spotlight Panel */}
      <section className="container mx-auto px-6 max-w-[1200px] mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spotlight Card */}
          <div className="relative rounded-2xl border border-white/5 bg-[#0A0A0A] p-8 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 min-h-[220px]">
            <div className="space-y-4 max-w-sm z-10">
              <span className="text-[9px] font-black tracking-[2px] text-[#CCFF00] uppercase">
                Brand Spotlight
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {spotlightProduct ? spotlightProduct.name : "Vaporesso XROS Pro"}
              </h2>
              <p className="text-xs text-[#C4C9AC] leading-relaxed">
                {spotlightDescription}
              </p>
              <Link
                href={spotlightProduct ? `/shop/${spotlightProduct.path.replace(/^\//, "")}` : "/shop"}
                className="inline-flex rounded-xl bg-white px-6 py-3 text-xs font-black tracking-widest text-black uppercase transition-all hover:bg-white/90 active:scale-[0.98]"
              >
                DISCOVER
              </Link>
            </div>

            {/* Dynamic Real Product Image Showcase */}
            <div className="relative w-36 h-44 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/5 group transition-all">
              {spotlightProduct ? (
                <Image
                  src={spotlightProduct.defaultImage?.url || "/products/productImg-1.jpg"}
                  alt={spotlightProduct.name}
                  fill
                  sizes="(max-width: 150px) 100vw"
                  className="object-contain p-2 transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <svg className="w-full h-full text-white/5 animate-pulse" viewBox="0 0 100 150" fill="currentColor">
                  <rect x="25" y="30" width="50" height="90" rx="8" fill="#111111" stroke="white" strokeWidth="2" />
                  <rect x="42" y="10" width="16" height="20" rx="2" fill="#222" stroke="white" strokeWidth="1.5" />
                  <rect x="48" y="2" width="4" height="8" rx="1" fill="#444" />
                  <circle cx="50" cy="50" r="10" fill="#CCFF00" opacity="0.8" />
                  <rect x="35" y="75" width="30" height="25" rx="3" fill="#000" stroke="white" strokeWidth="1" />
                  <line x1="40" y1="85" x2="60" y2="85" stroke="#CCFF00" strokeWidth="2" />
                </svg>
              )}
            </div>
          </div>

          {/* Dynamic Random Discovery Showcase Card */}
          <div className="relative rounded-2xl border border-[#CCFF00]/10 bg-[#0B0C08] p-8 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 min-h-[220px] transition-all duration-500 hover:border-[#CCFF00]/30 hover:shadow-[0_0_30px_rgba(204,255,0,0.05)] w-full">
            {/* Ambient Backlight Glow */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-[#CCFF00]/5 rounded-full blur-2xl pointer-events-none" />

            <div className={`space-y-4 max-w-sm z-10 transition-all duration-500 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <span className="text-[9px] font-black tracking-[2px] text-[#CCFF00] uppercase flex items-center gap-1.5">

                Random Discovery
              </span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate max-w-[280px]">
                {activeProduct ? activeProduct.name : "Premium Hardware"}
              </h2>
              <p className="text-xs text-[#C4C9AC] leading-relaxed line-clamp-2 min-h-[32px]">
                {activeProductDescription}
              </p>
              <Link
                href={activeProduct ? `/shop/${activeProduct.path.replace(/^\//, "")}` : "/shop"}
                className="inline-flex rounded-xl bg-[#CCFF00] px-6 py-3 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-[0.98]"
              >
                DISCOVER
              </Link>
            </div>

            {/* Dynamic Product Image */}
            <div className={`relative w-36 h-44 shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/5 group transition-all duration-500 ${fade ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-95 -rotate-2'}`}>
              {activeProduct ? (
                <Image
                  src={activeProduct.defaultImage?.url || "/products/productImg-1.jpg"}
                  alt={activeProduct.name}
                  fill
                  sizes="(max-width: 150px) 100vw"
                  className="object-contain p-2 transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <svg className="w-full h-full text-white/5 animate-pulse" viewBox="0 0 100 150" fill="currentColor">
                  <rect x="25" y="30" width="50" height="90" rx="8" fill="#111111" stroke="white" strokeWidth="2" />
                  <rect x="42" y="10" width="16" height="20" rx="2" fill="#222" stroke="white" strokeWidth="1.5" />
                  <rect x="48" y="2" width="4" height="8" rx="1" fill="#444" />
                  <circle cx="50" cy="50" r="10" fill="#CCFF00" opacity="0.8" />
                  <rect x="35" y="75" width="30" height="25" rx="3" fill="#000" stroke="white" strokeWidth="1" />
                  <line x1="40" y1="85" x2="60" y2="85" stroke="#CCFF00" strokeWidth="2" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
