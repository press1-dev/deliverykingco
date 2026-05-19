"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit3,
  ShieldCheck,
  Loader2,
  LogOut,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

// Types for dynamic data
type OrderStatus =
  | "SHIPPED"
  | "ACTIVE"
  | "CANCELLED"
  | "PROCESSING"
  | "COMPLETED"
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "AWAITING_SHIPMENT"
  | "AWAITING_FULFILLMENT"
  | "PARTIALLY_SHIPPED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "DECLINED"
  | "DISPUTED"
  | "INCOMPLETE"
  | "MANUAL_VERIFICATION_REQUIRED"
  | "AWAITING_PICKUP"
  | "UNKNOWN";

interface Order {
  id: number;
  orderId: string;
  productName: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
}

interface CustomerAddress {
  id: number;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  formatted: string;
}

interface CustomerProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateCreated: string;
  addresses: CustomerAddress[];
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  SHIPPED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  COMPLETED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  ACTIVE: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  PENDING: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  AWAITING_PAYMENT: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  AWAITING_SHIPMENT: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  AWAITING_FULFILLMENT: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  AWAITING_PICKUP: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  DECLINED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  REFUNDED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  PARTIALLY_REFUNDED: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
  PARTIALLY_SHIPPED: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/20",
  },
  PROCESSING: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  DISPUTED: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
  },
  INCOMPLETE: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
  },
  MANUAL_VERIFICATION_REQUIRED: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  UNKNOWN: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
  },
};

const ORDERS_PER_PAGE = 5;

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Dynamic state
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [ordersError, setOrdersError] = useState("");

  // Editable fields
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Fetch customer profile from BigCommerce
  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await fetch("/api/auth/customer", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      if (data.customer) {
        setProfile(data.customer);
        setEditPhone(data.customer.phone || "");
        const primaryAddr = data.customer.addresses?.[0];
        setEditAddress(primaryAddr?.formatted || "");
      }
    } catch {
      setProfileError("Could not load profile data.");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Fetch orders from BigCommerce
  const fetchOrders = useCallback(async (page: number) => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch(
        `/api/auth/orders?page=${page}&limit=${ORDERS_PER_PAGE}`,
        { credentials: "include" },
      );
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.totalCount || 0);
    } catch {
      setOrdersError("Could not load order history.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // Load profile when user is available
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;

    fetch("/api/auth/customer", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        if (data.customer) {
          setProfile(data.customer);
          setEditPhone(data.customer.phone || "");
          const addr = data.customer.addresses?.[0];
          setEditAddress(addr?.formatted || "");
        }
        setProfileLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setProfileError("Could not load profile data.");
          setProfileLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  // Load orders when user is available or page changes
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    fetch(`/api/auth/orders?page=${currentPage}&limit=${ORDERS_PER_PAGE}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) {
          setOrders(data.orders || []);
          setTotalOrders(data.totalCount || 0);
          setOrdersLoading(false);
          setOrdersError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrdersError("Could not load order history.");
          setOrdersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage, user]);

  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  // Filter orders by search (client-side on the current page)
  const filteredOrders = orders.filter(
    (order) =>
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getInitials = () => {
    if (profile) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return "DK";
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const getStatusStyle = (status: string) => {
    return STATUS_STYLES[status] || STATUS_STYLES.UNKNOWN;
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#CCFF00]" />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-zinc-500">
          <ShieldCheck size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-wider text-white uppercase">
            Authentication Required
          </h2>
          <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
            Please sign in to access your account dashboard, order history, and
            profile settings.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-xl bg-[#CCFF00] px-8 py-3 text-xs font-black tracking-widest text-black uppercase transition-all hover:bg-[#b3e600]"
        >
          Sign In
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : `${user.firstName} ${user.lastName}`;
  const displayEmail = profile?.email || user.email;
  const displayPhone = profile?.phone || user.phone || "";
  const primaryAddress = profile?.addresses?.[0];

  return (
    <div className="animate-fadeIn min-h-screen px-6 pt-10 pb-24 lg:px-12">
      {/* ========== PROFILE CARD ========== */}
      <div className="relative overflow-hidden rounded-2xl border border-[#CCFF00]/10 bg-[#080808] p-6 lg:p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-[#CCFF00]/5 blur-3xl" />

        {profileLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[#CCFF00]" />
            <span className="ml-3 text-xs text-zinc-400">
              Loading profile...
            </span>
          </div>
        ) : profileError ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-xs text-red-400">{profileError}</span>
            <button
              onClick={fetchProfile}
              className="ml-2 inline-flex items-center gap-1 text-[9px] font-black tracking-widest text-[#CCFF00] uppercase hover:text-[#b3e600]"
            >
              <RefreshCw size={10} />
              Retry
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Avatar + Name */}
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-[#CCFF00]/30 bg-[#0D0D0D] text-2xl font-black text-[#CCFF00]">
                  {getInitials()}
                </div>
                <div className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#080808] bg-[#CCFF00]">
                  <ShieldCheck size={10} className="text-black" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black tracking-wide text-white lg:text-xl">
                  {displayName}
                </h2>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail size={12} />
                  <span className="text-xs">{displayEmail}</span>
                </div>
              </div>
            </div>

            {/* Center: Phone + Address */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <div className="space-y-1">
                <span className="block text-[8px] font-black tracking-[3px] text-[#CCFF00] uppercase">
                  Phone Number
                </span>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-black px-3 py-1.5 text-xs text-white focus:border-[#CCFF00]/40 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <Phone size={12} className="text-zinc-500" />
                    {displayPhone || "Not set"}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="block text-[8px] font-black tracking-[3px] text-[#CCFF00] uppercase">
                  Shipping Address
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full rounded-lg border border-white/5 bg-black px-3 py-1.5 text-xs text-white focus:border-[#CCFF00]/40 focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <MapPin size={12} className="text-zinc-500" />
                    {primaryAddress?.formatted || "No address on file"}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Edit + Logout */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
                  isEditing
                    ? "border-[#CCFF00] bg-[#CCFF00] text-black hover:bg-[#b3e600]"
                    : "border-[#CCFF00]/20 bg-[#CCFF00]/5 text-[#CCFF00] hover:bg-[#CCFF00]/10"
                }`}
              >
                <Edit3 size={12} />
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-[10px] font-black tracking-widest text-zinc-400 uppercase transition-all hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
              >
                <LogOut size={12} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========== ORDER HISTORY SECTION ========== */}
      <div className="mt-10">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-black tracking-wider text-white uppercase">
              Order History
            </h3>
            {!ordersLoading && (
              <span className="text-[10px] text-zinc-500">
                ({totalOrders} total)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh button */}
            <button
              onClick={() => fetchOrders(currentPage)}
              disabled={ordersLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-[#0D0D0D] text-zinc-400 transition-all hover:border-white/10 hover:text-white disabled:opacity-30"
            >
              <RefreshCw
                size={13}
                className={ordersLoading ? "animate-spin" : ""}
              />
            </button>

            {/* Search */}
            <div className="flex items-center rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-2.5 transition-all focus-within:border-[#CCFF00]/30">
              <Search size={14} className="shrink-0 text-zinc-500" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-3 w-48 bg-transparent text-xs text-white placeholder-white/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#080808]">
          {/* Table Header */}
          <div className="hidden border-b border-white/5 bg-[#0A0A0A] px-6 py-4 lg:grid lg:grid-cols-12 lg:gap-4">
            <span className="col-span-3 text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Product
            </span>
            <span className="col-span-2 text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Order ID
            </span>
            <span className="col-span-2 text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Date
            </span>
            <span className="col-span-1 text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Total
            </span>
            <span className="col-span-2 text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Status
            </span>
            <span className="col-span-2 text-right text-[9px] font-black tracking-[3px] text-white/30 uppercase">
              Action
            </span>
          </div>

          {/* Loading State */}
          {ordersLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={24} className="animate-spin text-[#CCFF00]" />
              <p className="text-xs text-zinc-500">Loading your orders...</p>
            </div>
          ) : ordersError ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <AlertCircle size={24} className="text-red-400" />
              <p className="text-xs text-red-400">{ordersError}</p>
              <button
                onClick={() => fetchOrders(currentPage)}
                className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase hover:text-[#b3e600]"
              >
                <RefreshCw size={10} />
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Package size={28} className="text-zinc-600" />
              <p className="text-xs font-bold text-zinc-500">
                {searchQuery
                  ? "No orders match your search."
                  : "No orders yet."}
              </p>
              {!searchQuery && (
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase hover:text-[#b3e600]"
                >
                  Start Shopping
                  <ArrowRight size={10} />
                </Link>
              )}
            </div>
          ) : (
            filteredOrders.map((order, idx) => {
              const style = getStatusStyle(order.status);
              return (
                <div
                  key={order.id}
                  className={`group grid grid-cols-1 gap-4 px-6 py-5 transition-all duration-200 hover:bg-white/2 lg:grid-cols-12 lg:items-center ${
                    idx < filteredOrders.length - 1
                      ? "border-b border-white/5"
                      : ""
                  }`}
                >
                  {/* Product */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-[#0D0D0D] text-zinc-500">
                      <Package size={14} />
                    </div>
                    <span className="max-w-[180px] truncate text-xs font-bold text-white">
                      {order.productName}
                    </span>
                  </div>

                  {/* Order ID */}
                  <div className="col-span-2 flex items-center gap-2 lg:gap-0">
                    <span className="text-[9px] font-black tracking-widest text-white/30 uppercase lg:hidden">
                      Order:
                    </span>
                    <span className="text-xs font-bold text-[#CCFF00]/70">
                      {order.orderId}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center gap-2 lg:gap-0">
                    <span className="text-[9px] font-black tracking-widest text-white/30 uppercase lg:hidden">
                      Date:
                    </span>
                    <span className="text-xs text-zinc-400">{order.date}</span>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 flex items-center gap-2 lg:gap-0">
                    <span className="text-[9px] font-black tracking-widest text-white/30 uppercase lg:hidden">
                      Total:
                    </span>
                    <span className="text-xs font-bold text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 flex items-center gap-2 lg:gap-0">
                    <span className="text-[9px] font-black tracking-widest text-white/30 uppercase lg:hidden">
                      Status:
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[8px] font-black tracking-widest uppercase ${style.bg} ${style.text} ${style.border}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex items-center justify-start lg:justify-end">
                    <button className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest text-zinc-500 uppercase transition-all group-hover:text-zinc-300 hover:text-[#CCFF00]">
                      View Details
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {!ordersLoading && totalOrders > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[10px] text-zinc-500">
              Showing{" "}
              <span className="font-bold text-zinc-300">
                {filteredOrders.length}
              </span>{" "}
              of <span className="font-bold text-zinc-300">{totalOrders}</span>{" "}
              orders
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-[#0D0D0D] text-zinc-400 transition-all hover:border-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                          currentPage === page
                            ? "border border-[#CCFF00]/30 bg-[#CCFF00]/10 text-[#CCFF00]"
                            : "border border-white/5 bg-[#0D0D0D] text-zinc-400 hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-[#0D0D0D] text-zinc-400 transition-all hover:border-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
