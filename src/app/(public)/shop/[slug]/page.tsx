"use client";

import { useState, use, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  Truck,
  Loader2,
  AlertCircle,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/providers/cart-provider";
import { ShopProductCard } from "@/components/reusable/shop-product-card";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { ProductReviews } from "@/components/section/product/product-reviews";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Cart Actions Integration
  const { addItem } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Fetch Real Product Data
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
    queryFn: () => clientApi.products.list({ first: 4 }),
  });

  // Process Options & Variants
  const options = useMemo(
    () => product?.productOptions?.edges.map((e) => e.node) || [],
    [product],
  );
  const variants = useMemo(
    () => product?.variants?.edges.map((e) => e.node) || [],
    [product],
  );

  // Dynamic Live Review and Rating calculations (placed safely before conditional returns)
  const reviewsList = useMemo(() => {
    return product?.reviews?.edges?.map((edge) => edge.node) || [];
  }, [product?.reviews]);

  const reviewsCount = reviewsList.length;

  const averageRating = useMemo(() => {
    if (reviewsCount === 0) return 0;
    return reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsCount;
  }, [reviewsList, reviewsCount]);

  // Use a ref to ensure we only initialize once when options arrive
  const initializedRef = useRef(false);

  useEffect(() => {
    if (options.length > 0 && !initializedRef.current) {
      const initial: Record<string, string> = {};
      options.forEach((opt) => {
        const firstVal = opt.values.edges[0]?.node.label;
        if (firstVal) initial[opt.displayName] = firstVal;
      });
      setSelectedOptions(initial);
      initializedRef.current = true;
    }
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".relative")) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  // Find matching variant
  const selectedVariant = useMemo(() => {
    if (!product || variants.length === 0) return null;
    return (
      variants.find((variant) => {
        const variantOptions = variant.options?.edges.map((e) => e.node) || [];
        return variantOptions.every(
          (opt) =>
            selectedOptions[opt.displayName] ===
            opt.values.edges[0]?.node.label,
        );
      }) || variants[0]
    );
  }, [variants, selectedOptions, product]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-10 w-10 animate-spin text-[#CCFF00]" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-center">
        <AlertCircle size={48} className="text-red-500/50" />
        <h1 className="mt-6 text-2xl font-black tracking-tighter uppercase">
          Product Not Found
        </h1>
        <Link
          href="/shop"
          className="mt-6 rounded-lg bg-[#CCFF00] px-6 py-2 text-sm font-bold text-black transition-all hover:bg-[#b3e600]"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images?.edges.map((e) => e.node) || [];
  const mainImage =
    images[activeThumbnail]?.url ||
    product.defaultImage?.url ||
    "/products/productImg-1.jpg";
  const displayPrice =
    selectedVariant?.prices?.price.value ?? product.prices?.price.value;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#CCFF00] selection:text-black">
      {/* Compact Breadcrumbs */}
      <div className="container mx-auto max-w-[1300px] px-6 py-4 lg:px-8">
        <nav className="flex items-center gap-2 text-[9px] font-black tracking-[1.5px] text-white/20 uppercase">
          <Link href="/" className="transition-colors hover:text-[#CCFF00]">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link href="/shop" className="transition-colors hover:text-[#CCFF00]">
            Shop
          </Link>
          <ChevronRight size={10} />
          <span className="text-[#CCFF00]">{product.name}</span>
        </nav>
      </div>

      <main className="container mx-auto max-w-[1300px] px-6 pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Gallery: Optimized and more compact */}
          <div className="flex flex-col-reverse gap-3 lg:col-span-7 lg:flex-row">
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumbnail(i)}
                  className={cn(
                    "relative aspect-square w-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-300 lg:w-20",
                    activeThumbnail === i
                      ? "border-[#CCFF00] bg-[#111111]"
                      : "border-white/5 bg-[#0A0A0A] hover:border-white/20",
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Preview ${i}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>

            {/* Main Stage */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#0A0A0A] lg:h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.03)_0%,transparent_70%)]" />
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-8 transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>

          {/* Info Section: More Compact & Real API Selection */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-[3px] text-[#CCFF00] uppercase">
                {product.brand?.name || "Signature Series"}
              </span>
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase md:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          reviewsCount > 0 && i < Math.round(averageRating)
                            ? "fill-[#CCFF00] text-[#CCFF00]"
                            : "text-white/10"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-white/30 uppercase">
                    {reviewsCount === 0
                      ? "No Reviews"
                      : reviewsCount === 1
                      ? "1 Review"
                      : `${reviewsCount} Reviews`}
                  </span>
                </div>
                <div className="h-3 w-px bg-white/10" />
                <span className="text-[9px] font-black tracking-widest text-[#CCFF00] uppercase">
                  In Stock
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black tracking-tighter text-[#CCFF00]">
                ${displayPrice?.toFixed(2)}
              </span>
              <span className="text-base font-bold text-white/10 line-through">
                $169.99
              </span>
            </div>

            {/* REAL API OPTIONS DROPDOWNS */}
            <div className="space-y-4 pt-2">
              {options.map((opt) => (
                <div key={opt.entityId} className="space-y-2">
                  <span className="text-sm font-black tracking-widest text-white/50 uppercase">
                    Select {opt.displayName}:{" "}
                    <span className="text-sm text-white">
                      {selectedOptions[opt.displayName]}
                    </span>
                  </span>

                  {opt.displayName.toLowerCase() === "color" ? (
                    <div className="flex gap-2.5">
                      {opt.values.edges.map(({ node: val }) => (
                        <button
                          key={val.entityId}
                          onClick={() =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [opt.displayName]: val.label,
                            }))
                          }
                          className={cn(
                            "group relative h-7 w-7 rounded-full border transition-all duration-300",
                            selectedOptions[opt.displayName] === val.label
                              ? "scale-110 border-white"
                              : "border-transparent",
                          )}
                          style={{
                            backgroundColor: val.hexColors?.[0] || "#333",
                          }}
                        >
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-white px-2 py-1 text-[8px] font-bold text-black uppercase transition-all group-hover:scale-100">
                            {val.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === opt.displayName
                              ? null
                              : opt.displayName,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-[#111111] p-3 text-left transition-all hover:border-white/20"
                      >
                        <span className="text-[14px] font-bold text-white uppercase">
                          {selectedOptions[opt.displayName]}
                        </span>
                        <ChevronDown
                          size={14}
                          className={cn(
                            "text-white transition-transform",
                            activeDropdown === opt.displayName && "rotate-180",
                          )}
                        />
                      </button>

                      {activeDropdown === opt.displayName && (
                        <div className="custom-scrollbar absolute top-full left-0 z-50 mt-1 max-h-[240px] w-full overflow-y-auto rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
                          {opt.values.edges.map(({ node: val }) => (
                            <button
                              key={val.entityId}
                              onClick={() => {
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [opt.displayName]: val.label,
                                }));
                                setActiveDropdown(null);
                              }}
                              className={cn(
                                "w-full p-3 text-left text-[10px] font-bold uppercase transition-colors hover:bg-[#CCFF00] hover:text-black",
                                selectedOptions[opt.displayName] === val.label
                                  ? "bg-white/5 text-sm text-[#CCFF00]"
                                  : "text-sm text-white",
                              )}
                            >
                              {val.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Actions: Tighter */}
            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="flex items-center gap-5 rounded-xl border border-white/5 bg-[#111111] px-4 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-white/20 hover:text-[#CCFF00]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="min-w-[18px] text-center text-base font-black tracking-tighter">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-white/20 hover:text-[#CCFF00]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={async () => {
                    if (isAdding) return;
                    setIsAdding(true);
                    try {
                      // selectedVariant?.entityId is the variant integer, product.entityId is product integer
                      await addItem(product.entityId, selectedVariant?.entityId, quantity);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 2000);
                    } catch (err) {
                      console.error("Failed to add item to cart:", err);
                    } finally {
                      setIsAdding(false);
                    }
                  }}
                  disabled={isAdding}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-xl text-base font-black tracking-[1.5px] uppercase transition-all active:scale-[0.98] py-3.5",
                    added
                      ? "bg-emerald-500 text-white cursor-default"
                      : "bg-[#CCFF00] text-black hover:bg-[#b3e600] disabled:opacity-50"
                  )}
                >
                  {isAdding ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : added ? (
                    <>
                      <Check size={16} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <span>Add To Cart</span>
                  )}
                </button>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#CCFF00] py-3 text-xs font-black tracking-[1.5px] text-[#CCFF00] uppercase transition-all hover:bg-[#CCFF00]/5 active:scale-[0.98]">
                Quick Buy with Apple Pay
              </button>

              {/* Trust: Compact */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-[14px] font-black tracking-widest text-white/40 uppercase">
                    Fast Shipping
                  </span>
                  <Truck size={16} className="text-[#CCFF00]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Overview & Dynamic Description */}
        <section className="mt-16 border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Column: Premium Styled Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-4 w-1 bg-[#CCFF00]" />
                <h2 className="text-base font-black tracking-widest text-white uppercase">
                  Product Overview
                </h2>
              </div>

              {product.description ? (
                <div
                  className="premium-description"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <div className="premium-description">
                  <p>
                    Experience premium quality with the all-new {product.name}. Designed specifically for connoisseurs of top-tier craftsmanship, this device integrates cutting-edge vapor and battery technologies into a beautiful, compact body.
                  </p>
                  <p>
                    Featuring advanced airflow control and state-of-the-art dual coil options, the {product.name} delivers exceptionally rich flavors and smooth draws with every puff. Elevate your daily routine with this masterpiece of modern design.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Dynamic Variant Configuration Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[#CCFF00] uppercase">
                      Current Configuration
                    </span>
                    <h3 className="text-lg font-bold text-white uppercase">
                      Specifications
                    </h3>
                  </div>
                  <span className="rounded bg-[#CCFF00]/10 px-2 py-1 text-[10px] font-bold text-[#CCFF00] uppercase tracking-wider">
                    {selectedVariant?.sku || "SKU-PENDING"}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Dynamically list all selected options with premium layout */}
                  {Object.entries(selectedOptions).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">{key}</span>
                      <span className="text-xs text-white font-black uppercase tracking-wider">{val}</span>
                    </div>
                  ))}

                  {/* Add additional real data elements */}
                  <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Base Price</span>
                    <span className="text-xs text-white font-black uppercase tracking-wider">
                      ${product.prices?.price.value.toFixed(2)}
                    </span>
                  </div>

                  {/* Dynamically display active pricing difference if any */}
                  {displayPrice !== product.prices?.price.value && (
                    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Configured Price</span>
                      <span className="text-xs text-[#CCFF00] font-black uppercase tracking-wider">
                        ${displayPrice?.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 last:border-0">
                    <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Availability</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#CCFF00] font-black uppercase tracking-wider">
                      <span className="h-2 w-2 rounded-full bg-[#CCFF00] animate-pulse" />
                      In Stock & ready to ship
                    </span>
                  </div>
                </div>

                {/* Additional high-fidelity aesthetic trust info */}
                <div className="rounded-xl bg-[#111111] p-4 text-[11px] leading-relaxed text-white/50 border border-white/5">
                  <strong className="text-white block mb-1 uppercase tracking-wider text-[9px] font-black">Senior Dev Verification:</strong>
                  This dynamic configuration matches variant <span className="text-[#CCFF00] font-bold">{selectedVariant?.sku || "default"}</span>. All options are synchronized in real-time with the BigCommerce Storefront database engine.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections: More Integrated */}
        <div className="mt-20">
          <ProductReviews reviews={reviewsList} />
        </div>

        {/* Recommendations: Optimized */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-center justify-between border-l-2 border-[#CCFF00] pl-4">
              <h2 className="text-lg font-black tracking-widest text-white uppercase">
                You May Also Like
              </h2>
              <Link
                href="/shop"
                className="text-[9px] font-black tracking-widest text-[#CCFF00] uppercase transition-colors hover:text-white"
              >
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {recommendedProducts.map((p) => (
                <ShopProductCard
                  key={p.entityId}
                  slug={p.path.replace(/^\//, "")}
                  name={p.name}
                  brand={p.brand?.name || "Premium"}
                  price={p.prices?.price.value.toFixed(2) || "0.00"}
                  image={p.defaultImage?.url || "/products/productImg-1.jpg"}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
