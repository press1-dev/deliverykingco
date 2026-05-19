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
} from "lucide-react";

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  pricePerUnit: number;
  stockStatus: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: "nexus-pro-x1",
      title: "NEXUS PRO X1",
      subtitle: "Color: Midnight Obsidian",
      image: "/products/nexus-pro-x1.png",
      pricePerUnit: 89.99,
      stockStatus: "IN STOCK - SHIPS TODAY",
      quantity: 1,
    },
    {
      id: "neon-tropics-ejuice",
      title: "NEON TROPICS E-JUICE",
      subtitle: "Flavor: Dragonfruit Lychee | 3mg",
      image: "/products/neon-tropics.png",
      pricePerUnit: 22.99,
      stockStatus: "IN STOCK",
      quantity: 2,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  // Math Calculations
  const subtotal = items.reduce((acc, item) => acc + item.pricePerUnit * item.quantity, 0);
  const tax = subtotal * 0.0825; // 8.25% Denver tax rate rounded
  const total = subtotal + tax;

  const handleUpdateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-24 text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="container mx-auto max-w-[1250px] px-6 lg:px-12 animate-fadeIn">
        
        {/* Cart Title Section */}
        <div className="flex items-end justify-between border-b border-white/5 pb-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
              Your Cart
            </h1>
          </div>
          <span className="text-xs font-black tracking-widest text-zinc-500 uppercase mb-1">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-500">
              <Trash2 size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black tracking-wider text-white uppercase">
                Your cart is empty
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Add premium vape kits, e-liquids, and hardware from our Denver inventory.
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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
            
            {/* Left Cart Items List (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-white/5 bg-[#080808] p-6 hover:border-white/10 transition-all duration-300"
                >
                  {/* Left Side: Thumbnail & Label */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                    
                    {/* Glowing Product Thumbnail */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-black flex items-center justify-center">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                      <Image
                        src={item.image}
                        alt={item.title}
                        height={112}
                        width={112}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Product Specs */}
                    <div className="text-center sm:text-left space-y-2">
                      <h3 className="text-base font-black tracking-wide text-white uppercase">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium">
                        {item.subtitle}
                      </p>
                      <span className="inline-block text-[9px] font-black tracking-wider text-[#CCFF00] bg-[#CCFF00]/5 border border-[#CCFF00]/10 px-2 py-0.5 rounded">
                        {item.stockStatus}
                      </span>
                    </div>

                  </div>

                  {/* Right Side: Price, Qty and Actions */}
                  <div className="flex flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0">
                    
                    {/* Qty Capsule Selector */}
                    <div className="flex items-center bg-[#000] border border-white/5 rounded-full px-2 py-1 gap-4">
                      <button
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-black text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Price and Action Wrapper */}
                    <div className="text-right space-y-2 shrink-0">
                      <p className="text-base font-black tracking-wider text-[#CCFF00]">
                        ${(item.pricePerUnit * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center justify-end gap-1.5 text-[9px] font-black text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-all"
                      >
                        <Trash2 size={10} />
                        <span>Remove</span>
                      </button>
                    </div>

                  </div>

                </div>
              ))}

              {/* Bottom Action Links */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-zinc-400 hover:text-[#CCFF00] uppercase transition-all"
                >
                  <ArrowLeft size={12} />
                  <span>Continue Shopping</span>
                </Link>

                <button
                  onClick={handleClearCart}
                  className="text-[10px] font-black tracking-widest text-zinc-400 hover:text-red-400 uppercase transition-all"
                >
                  Clear All Items
                </button>
              </div>

            </div>

            {/* Right Order Summary Panel (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl border border-white/5 bg-[#080808] p-8 space-y-6 overflow-hidden">
                <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#CCFF00]/5 blur-3xl" />

                <h2 className="text-sm font-black tracking-wider text-white uppercase border-b border-white/5 pb-4">
                  Order Summary
                </h2>

                {/* Subtotal, Shipping, Tax rows */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <span>Shipping</span>
                      <HelpCircle size={12} className="text-zinc-500 cursor-help" />
                    </div>
                    <span className="font-black text-[#CCFF00]">FREE</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-zinc-300">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-white">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  {/* Total row matching mockup layout */}
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-black text-white uppercase tracking-wider">
                        Total
                      </span>
                      <span className="block text-[6px] tracking-wider text-zinc-500 uppercase">
                        Secure checkout powered by NexusPay
                      </span>
                    </div>
                    <span className="text-3xl font-black text-[#CCFF00] tracking-tight">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Input Capsule */}
                <div className="flex items-center rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 justify-between">
                  <input
                    type="text"
                    placeholder="PROMO CODE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="bg-transparent text-xs text-white placeholder-white/20 font-black tracking-wider focus:outline-none w-3/4"
                  />
                  <button
                    onClick={() => {
                      if (promoCode) {
                        alert(`Promo code "${promoCode}" applied!`);
                      }
                    }}
                    className="text-[10px] font-black uppercase text-[#CCFF00] hover:text-[#b3e600] transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-[#CCFF00] hover:bg-[#b3e600] text-black font-black py-4 uppercase tracking-widest text-xs rounded-xl transition-all duration-300 active:scale-[0.98]">
                  Proceed To Checkout
                </button>

                {/* Custom Payment Cards Row */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="h-6 w-10 rounded bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                    Visa
                  </div>
                  <div className="h-6 w-10 rounded bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                    MC
                  </div>
                  <div className="h-6 w-10 rounded bg-[#0D0D0D] border border-white/5 flex items-center justify-center text-[7px] font-black text-[#CCFF00] uppercase tracking-widest">
                    Nexus
                  </div>
                </div>

                {/* Verification disclaimer badge */}
                <div className="flex gap-3 rounded-xl border border-white/5 bg-black/40 p-4">
                  <div className="mt-0.5 text-[#CCFF00] shrink-0">
                    <ShieldAlert size={14} />
                  </div>
                  <p className="text-[9px] leading-relaxed text-zinc-400">
                    Age verification is required upon delivery. You must be 21+ to receive this shipment.
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
