"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  HelpCircle,
  ShieldAlert,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";
import { useCartContext } from "@/providers/cart-provider";

export default function CartPage() {
  const {
    cart,
    isLoading,
    error,
    updateItemQty,
    removeItem,
    clearCart,
    refreshCart,
  } = useCartContext();

  const [promoCode, setPromoCode] = useState("");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const items = cart?.items || [];
  const itemCount = cart?.itemCount || 0;

  // Use real BigCommerce totals
  const subtotal = cart?.baseAmount || 0;
  const discount = cart?.discountAmount || 0;
  const total = cart?.cartAmount || 0;
  const estimatedTax =
    total > subtotal - discount ? total - (subtotal - discount) : 0;

  const handleUpdateQty = async (
    itemId: string,
    productId: number,
    variantId: number,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = Math.max(1, currentQty + delta);
    if (newQty === currentQty) return;

    setUpdatingItems((prev) => new Set(prev).add(itemId));
    await updateItemQty(itemId, productId, variantId, newQty);
    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    await removeItem(itemId);
    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black pt-16 pb-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-[#CCFF00]" />
          <p className="text-xs text-zinc-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 pb-24 text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="animate-fadeIn container mx-auto max-w-[1250px] px-6 lg:px-12">
        {/* Cart Title Section */}
        <div className="mb-10 flex items-end justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
              Your Cart
            </h1>
            <button
              onClick={refreshCart}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-400 transition-all hover:text-white"
              aria-label="Refresh cart"
            >
              <RefreshCw size={12} />
            </button>
          </div>
          <span className="mb-1 text-xs font-black tracking-widest text-zinc-500 uppercase">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs font-bold text-red-400">
            {error}
          </div>
        )}

        {!cart || items.length === 0 ? (
          <div className="space-y-6 py-24 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-500">
              <ShoppingCart size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-wider text-white uppercase">
                Your cart is empty
              </h3>
              <p className="mx-auto max-w-xs text-xs leading-relaxed text-zinc-400">
                Add premium vape kits, e-liquids, and hardware from our Denver
                inventory.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-6 py-3 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600]"
            >
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* Left Cart Items List (8 Columns) */}
            <div className="space-y-6 lg:col-span-8">
              {items.map((item) => {
                const isUpdating = updatingItems.has(item.id);
                const optionsLabel = item.options
                  .map((o) => `${o.name}: ${o.value}`)
                  .join(" | ");

                return (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/5 bg-[#080808] p-6 transition-all duration-300 hover:border-white/10 sm:flex-row ${
                      isUpdating ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {/* Loading overlay */}
                    {isUpdating && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/40">
                        <Loader2
                          size={18}
                          className="animate-spin text-[#CCFF00]"
                        />
                      </div>
                    )}

                    {/* Left Side: Thumbnail & Label */}
                    <div className="flex w-full flex-col items-center gap-6 sm:w-auto sm:flex-row">
                      {/* Product Thumbnail */}
                      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-black">
                        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/40 to-transparent" />
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            height={112}
                            width={112}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600">
                            <ShoppingCart size={24} />
                          </div>
                        )}
                      </div>

                      {/* Product Specs */}
                      <div className="space-y-2 text-center sm:text-left">
                        <h3 className="text-base font-black tracking-wide text-white uppercase">
                          {item.name}
                        </h3>
                        {optionsLabel && (
                          <p className="text-sm font-medium text-zinc-300/90">
                            {optionsLabel}
                          </p>
                        )}
                        {item.sku && (
                          <p className="line-clamp-1 max-w-[180px] text-[9px] font-bold tracking-widest text-zinc-500/80 uppercase">
                            SKU: {item.sku}
                          </p>
                        )}
                        <span className="inline-block rounded border border-[#CCFF00]/10 bg-[#CCFF00]/5 px-2 py-0.5 text-[9px] font-black tracking-wider text-[#CCFF00]">
                          IN STOCK
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Price, Qty and Actions */}
                    <div className="flex w-full flex-row items-center justify-between gap-6 border-t border-white/5 pt-4 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                      {/* Qty Capsule Selector */}
                      <div className="flex items-center gap-4 rounded-full border border-white/5 bg-black px-2 py-1">
                        <button
                          onClick={() =>
                            handleUpdateQty(
                              item.id,
                              item.productId,
                              item.variantId,
                              item.quantity,
                              -1,
                            )
                          }
                          disabled={isUpdating || item.quantity <= 1}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/5 hover:text-white disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-4 text-center text-xs font-black text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQty(
                              item.id,
                              item.productId,
                              item.variantId,
                              item.quantity,
                              1,
                            )
                          }
                          disabled={isUpdating}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/5 hover:text-white disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Price and Action Wrapper */}
                      <div className="shrink-0 space-y-2 text-right">
                        <p className="text-base font-black tracking-wider text-[#CCFF00]">
                          ${item.extendedSalePrice.toFixed(2)}
                        </p>
                        {item.listPrice !== item.salePrice && (
                          <p className="text-[10px] text-zinc-500 line-through">
                            ${item.extendedListPrice.toFixed(2)}
                          </p>
                        )}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                          className="flex cursor-pointer items-center justify-end gap-1.5 text-[12px] font-bold tracking-widest text-[#AA0E03] uppercase transition-all hover:text-red-400 disabled:opacity-30"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Action Links */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:text-[#CCFF00]"
                >
                  <ArrowLeft size={12} />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  onClick={handleClearCart}
                  className="text-[10px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:text-red-400"
                >
                  Clear All Items
                </button>
              </div>
            </div>

            {/* Right Order Summary Panel (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="relative space-y-6 overflow-hidden rounded-2xl border border-white/5 bg-[#080808] p-8">
                <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#CCFF00]/5 blur-3xl" />

                <h2 className="border-b border-white/5 pb-4 text-lg font-black tracking-wider text-white uppercase">
                  Order Summary
                </h2>

                {/* Subtotal, Discount, Shipping, Tax rows */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-zinc-300">
                    <span className="text-base font-semibold text-zinc-300">
                      Subtotal
                    </span>
                    <span className="text-base font-bold text-white">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-zinc-300">
                      <span>Discount</span>
                      <span className="font-bold text-emerald-400">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-base text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <span>Shipping</span>
                      <HelpCircle
                        size={12}
                        className="cursor-help text-zinc-500"
                      />
                    </div>
                    <span className="font-black text-[#CCFF00]">FREE</span>
                  </div>

                  <div className="flex items-center justify-between text-base text-zinc-300">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-white">
                      ${estimatedTax.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="block text-base font-black tracking-wider text-white uppercase">
                        Total
                      </span>
                      <span className="block text-[10px] tracking-wider text-zinc-300 uppercase">
                        {cart?.currency || "USD"} · Secure checkout
                      </span>
                    </div>
                    <span className="text-3xl font-black tracking-tight text-[#CCFF00]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Input Capsule */}
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-3/4 bg-transparent text-xs font-black tracking-wider text-white placeholder-white/20 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (promoCode) {
                        alert(`Promo code "${promoCode}" applied!`);
                      }
                    }}
                    className="text-[10px] font-black text-[#CCFF00] uppercase transition-colors hover:text-[#b3e600]"
                  >
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button className="w-full rounded-xl bg-[#CCFF00] py-4 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98]">
                  Proceed To Checkout
                </button>

                {/* Payment Cards Row */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-white/5 bg-[#0D0D0D] text-[7px] font-black tracking-widest text-zinc-500 uppercase">
                    Visa
                  </div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-white/5 bg-[#0D0D0D] text-[7px] font-black tracking-widest text-zinc-500 uppercase">
                    MC
                  </div>
                  <div className="flex h-6 w-10 items-center justify-center rounded border border-white/5 bg-[#0D0D0D] text-[7px] font-black tracking-widest text-zinc-500 uppercase">
                    Amex
                  </div>
                </div>

                {/* Age Verification */}
                <div className="flex gap-3 rounded-xl border border-white/5 bg-black/40 p-4">
                  <div className="mt-0.5 shrink-0 text-[#CCFF00]">
                    <ShieldAlert size={14} />
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    Age verification is required upon delivery. You must be 21+
                    to receive this shipment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
