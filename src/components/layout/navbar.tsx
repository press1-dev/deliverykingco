"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: "Home", href: "/", active: true },
  { name: "Shop", href: "/shop" },
  { name: "Brands", href: "/brands" },
  { name: "Policies & Information", href: "/policies" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <h1 className="font-heading text-xl font-black tracking-tighter text-[#CCFF00] italic transition-transform duration-300 group-hover:scale-105 lg:text-2xl">
                DELIVERY KING
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-heading relative py-2 text-[11px] font-bold tracking-[1.1px] uppercase transition-colors",
                    link.active
                      ? "text-[#CCFF00] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#CCFF00]"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar (Desktop) */}
            <div className="hidden items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 transition-all focus-within:border-[#CCFF00]/50 focus-within:bg-white/10 lg:flex">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                placeholder="Search devices, pods......"
                className="ml-3 w-48 bg-transparent text-xs text-white outline-none placeholder:text-white/20 xl:w-64"
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4 lg:gap-5">
              <button className="text-white/60 transition-colors hover:text-[#CCFF00]">
                <User size={22} strokeWidth={1.5} />
              </button>

              <button className="relative text-[#CCFF00] transition-transform hover:scale-110">
                <ShoppingCart size={22} strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-lg">
                  2
                </span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="text-white lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-20 z-40 bg-black transition-transform duration-300 lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col space-y-6 p-6">
          {/* Mobile Search */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-white/40" />
            <input
              type="text"
              placeholder="Search devices..."
              className="ml-3 w-full bg-transparent text-sm text-white outline-none"
            />
          </div>

          <div className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-lg font-bold tracking-widest uppercase",
                  link.active ? "text-[#CCFF00]" : "text-white",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
