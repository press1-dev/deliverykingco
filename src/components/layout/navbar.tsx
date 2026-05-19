"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Search, User, ShoppingCart, Menu, X, LogOut, Settings, ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useCartContext } from "@/providers/cart-provider";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Brands", href: "/brands" },
  { name: "Policies & Information", href: "/policies" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { cart } = useCartContext();
  const profileRef = useRef<HTMLDivElement>(null);
  const cartCount = cart?.itemCount || 0;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    router.push("/");
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group">
              <h1 className="font-heading text-xl font-black tracking-tighter text-[#CCFF00] transition-transform duration-300 group-hover:scale-105 lg:text-2xl">
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
                    "font-heading group relative py-2 text-sm font-bold tracking-[1.1px] uppercase transition-colors",
                    isActive(link.href) ? "text-[#CCFF00]" : "text-white/60 hover:text-white",
                  )}
                >
                  {link.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-[2px] w-full bg-[#CCFF00] transition-transform duration-300 ease-out",
                      isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
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
              {/* Profile / Auth Button */}
              {isLoading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-white/5" />
              ) : user ? (
                /* Logged In: Profile dropdown */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-2 py-1.5 transition-all hover:border-[#CCFF00]/20 hover:bg-[#CCFF00]/5"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#CCFF00] text-[10px] font-black text-black">
                      {getInitials()}
                    </div>
                    <ChevronDown
                      size={12}
                      className={cn(
                        "hidden text-zinc-400 transition-transform duration-200 lg:block",
                        isProfileOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0D] shadow-2xl shadow-black/60 animate-fadeIn">
                      {/* User Info */}
                      <div className="border-b border-white/5 p-4">
                        <p className="text-xs font-black tracking-wide text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                        >
                          <Settings size={14} />
                          Account Settings
                        </Link>

                        <Link
                          href="/cart"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
                        >
                          <ShoppingCart size={14} />
                          My Cart
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-400 transition-all hover:bg-red-500/5 hover:text-red-300"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not Logged In: Login icon link */
                <Link
                  href="/login"
                  className="text-white/60 transition-colors hover:text-[#CCFF00]"
                >
                  <User size={22} strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart icon */}
              <Link
                href="/cart"
                className="relative text-[#CCFF00] transition-transform hover:scale-110"
              >
                <ShoppingCart size={22} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black shadow-lg">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

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
                  isActive(link.href) ? "text-[#CCFF00]" : "text-white",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div className="border-t border-white/5 pt-6 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCFF00] text-[10px] font-black text-black">
                    {getInitials()}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 text-xs font-black tracking-widest text-red-400 uppercase"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-3 text-xs font-black tracking-widest text-black uppercase"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-black tracking-widest text-white uppercase"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
