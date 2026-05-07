"use client";

import { useState, use, useMemo } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  // Fetch Real Product Data (Now includes variants)
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => clientApi.products.getBySlug(slug),
  });

  // Fetch Recommendations
  const { data: recommendedProducts } = useQuery({
    queryKey: ["recommended-products"],
    queryFn: () => clientApi.products.list({ first: 3 }),
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Senior Developer Logic: Process Variants
  const variants = useMemo(() => product?.variants?.edges.map(e => e.node) || [], [product]);
  const selectedVariant = useMemo(() => 
    variants.find(v => v.entityId === selectedVariantId) || variants[0], 
  [variants, selectedVariantId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-[#CCFF00]" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center">
        <AlertCircle size={64} className="text-red-500/50" />
        <h1 className="mt-6 text-3xl font-black tracking-tighter uppercase">Product Not Found</h1>
        <p className="mt-4 text-[#C4C9AC]">The requested nexus device could not be located.</p>
        <Link href="/shop" className="mt-8 rounded-lg bg-[#CCFF00] px-8 py-3 font-bold text-black transition-all hover:bg-[#b3e600]">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.edges.map((e) => e.node) || [];
  const mainImage = images[activeThumbnail]?.url || product.defaultImage?.url || "/products/productImg-1.jpg";

  // Get pricing from selected variant or base product
  const displayPrice = selectedVariant?.prices?.price.value ?? product.prices?.price.value;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6 lg:px-12">
        <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/40 uppercase">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="transition-colors hover:text-white">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-[#CCFF00]">{product.name}</span>
        </nav>
      </div>

      <main className="container mx-auto px-6 pb-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Left: Product Gallery */}
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-4 md:flex-col">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveThumbnail(i)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all",
                    activeThumbnail === i ? "border-[#CCFF00]" : "border-white/5 hover:border-white/20",
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${i}`}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0A0A0A] lg:h-[500px]">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-all duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black tracking-[3.6px] text-[#CCFF00] uppercase">
                {product.brand?.name || "Signature Series"}
              </span>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-white uppercase lg:text-5xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#CCFF00] text-[#CCFF00]" />
                  ))}
                </div>
                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">128 Reviews</span>
                <div className="h-4 w-px bg-white/10" />
                <span className="rounded-sm bg-[#CCFF00]/10 px-2 py-1 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase">In Stock</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-heading text-3xl font-black text-[#CCFF00]">
                ${displayPrice}
              </span>
            </div>

            {/* REAL VARIANT DROPDOWN */}
            {variants.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                    Select Variant:
                  </span>
                  
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-white/20"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-[#CCFF00]">
                          {selectedVariant?.sku || "STANDARD"}
                        </span>
                        <span className="mt-1 text-sm font-bold text-white">
                          {selectedVariant?.options?.edges?.[0]?.node.values.edges?.[0]?.node.label || "Standard Edition"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-black text-white">
                          ${selectedVariant?.prices?.price.value}
                        </span>
                        <ChevronRight className={cn("transition-transform duration-300", isDropdownOpen ? "rotate-90" : "rotate-0")} size={20} />
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl custom-scrollbar">
                        {variants.map((variant) => (
                          <button
                            key={variant.entityId}
                            onClick={() => {
                              setSelectedVariantId(variant.entityId);
                              setIsDropdownOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/5",
                              selectedVariant?.entityId === variant.entityId ? "bg-[#CCFF00]/10" : ""
                            )}
                          >
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase text-white/30">SKU: {variant.sku}</span>
                              <span className="text-xs font-bold text-white">
                                {variant.options?.edges?.[0]?.node.values.edges?.[0]?.node.label || "Standard Edition"}
                              </span>
                            </div>
                            <span className="text-xs font-black text-[#CCFF00]">
                              ${variant.prices?.price.value}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-6">
              <div className="flex gap-4">
                <div className="flex items-center gap-6 rounded-lg border border-white/10 bg-white/5 px-6">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white"><Minus size={16} /></button>
                  <span className="font-heading min-w-6 text-center text-lg font-bold">{quantity.toString().padStart(2, "0")}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white"><Plus size={16} /></button>
                </div>
                <button className="font-heading flex-1 rounded-lg bg-[#CCFF00] py-4 text-sm font-black tracking-widest text-black uppercase transition-all hover:bg-[#b3e600] active:scale-95">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-32 space-y-12">
          <div className="flex border-b border-white/10">
            <button className="border-b-2 border-[#CCFF00] pr-12 pb-4 text-sm font-bold tracking-widest uppercase">Description</button>
            <button className="pr-12 pb-4 text-sm font-bold tracking-widest text-white/20 uppercase hover:text-white/40">Specifications</button>
          </div>
          
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl font-black tracking-tighter uppercase">Beyond the Clouds</h2>
              <div
                className="font-body text-lg leading-relaxed text-[#C4C9AC]"
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            </div>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src={mainImage}
                alt="Product feature"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-50 grayscale transition-all duration-700 hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/40" />
              <p className="font-heading relative z-10 text-xl font-black tracking-tighter uppercase">Premium Engineering</p>
            </div>
          </div>
        </div>

        {/* Recommendation Items */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div className="mt-40 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-black tracking-tighter uppercase lg:text-3xl">You May Also Like</h2>
              <Link href="/shop" className="text-xs font-bold tracking-widest text-[#CCFF00] uppercase hover:underline">View All &rarr;</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedProducts.map((p) => (
                <ShopProductCard
                  key={p.entityId}
                  slug={p.path.replace(/^\//, "")}
                  name={p.name}
                  brand={p.brand?.name || "Premium Brand"}
                  price={p.prices?.price.value.toString() || "0.00"}
                  image={p.defaultImage?.url || "/products/productImg-1.jpg"}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
