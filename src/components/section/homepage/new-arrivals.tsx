"use client";

import Image from "next/image";
import { useProducts } from "@/features/products/use-products";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export const NewArrivalSection = () => {
  const { data: products, isLoading } = useProducts({ first: 3 });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#CCFF00]" />
      </div>
    );
  }

  const mainProduct = products?.[0];
  const sideProducts = products?.slice(1, 3) || [];

  return (
    <section className="w-full py-2 text-white">
      <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-3">
        {/* LEFT: HERO */}
        <div className="relative min-h-[250px] items-center overflow-hidden rounded-xl bg-linear-to-b from-black/80 to-black/0 md:flex lg:col-span-2 lg:min-h-[450px]">
          {/* Content */}
          <div className="z-10 max-w-md p-6 lg:p-10">
            <p className="mb-2 text-xs tracking-widest text-green-400">
              LIMITED EDITION
            </p>

            <h2 className="mb-3 text-2xl font-bold lg:text-3xl uppercase tracking-tighter">
              {mainProduct?.name || "NEXUS PRO - PHANTOM LIME"}
            </h2>

            <p className="mb-6 text-sm text-gray-400">
              Experience the ultimate power delivery with our new dual-mesh coil
              technology.
            </p>

            <Link href={mainProduct ? `/shop/${mainProduct.path.replace(/^\//, '')}` : "/shop"}>
              <button className="cursor-pointer rounded-md bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200">
                ORDER NOW
              </button>
            </Link>
          </div>

          {/* Right Product Image */}
          <div className="relative h-96 w-full lg:h-full lg:flex-1">
            <Image
              src={mainProduct?.defaultImage?.url || "/products/productImg-1.jpg"}
              alt={mainProduct?.name || "Nexus Pro"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />
          </div>
        </div>

        {/* RIGHT: SIDE CARDS */}
        <div className="flex h-full flex-col gap-2">
          {sideProducts.map((product) => (
            <div key={product.entityId} className="flex h-full items-center justify-between rounded-xl bg-linear-to-b from-black/80 to-black/0 p-5">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="mb-2 font-semibold line-clamp-2 text-sm uppercase">
                    {product.name}
                  </h3>
                  <p className="text-base text-[#CCFF00] font-bold">
                    ${product.prices?.price.value}
                  </p>
                </div>
                <Link href={`/shop/${product.path.replace(/^\//, '')}`}>
                  <button className="mt-5 cursor-pointer rounded-md bg-white px-3 py-1.5 text-[10px] font-black text-black transition hover:bg-gray-200 uppercase tracking-widest">
                    ORDER NOW
                  </button>
                </Link>
              </div>

              <div className="relative h-32 w-32 shrink-0">
                <Image
                  src={product.defaultImage?.url || "/products/productImg-1.jpg"}
                  alt={product.name}
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
          
          {sideProducts.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-xl border border-white/5 bg-white/5">
              <p className="text-xs text-white/20 italic">More arrivals coming soon</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
