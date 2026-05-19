"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

// Static order data matching the screenshot
type OrderStatus = "SHIPPED" | "ACTIVE" | "CANCELLED" | "PROCESSING";

interface Order {
  id: string;
  product: string;
  orderId: string;
  date: string;
  total: number;
  status: OrderStatus;
}

const STATIC_ORDERS: Order[] = [
  {
    id: "1",
    product: "Vape Flux Pro",
    orderId: "#VN-8842",
    date: "Oct 24, 2024",
    total: 129.99,
    status: "SHIPPED",
  },
  {
    id: "2",
    product: "Neon Pods Kit",
    orderId: "#VN-8715",
    date: "Sep 12, 2024",
    total: 45.5,
    status: "ACTIVE",
  },
  {
    id: "3",
    product: "Ultra Mesh Coil",
    orderId: "#VN-8690",
    date: "Aug 28, 2024",
    total: 210.0,
    status: "CANCELLED",
  },
  {
    id: "4",
    product: "Citrus Mist 30ml",
    orderId: "#VN-8544",
    date: "Aug 05, 2024",
    total: 89.0,
    status: "PROCESSING",
  },
  {
    id: "5",
    product: "Nexus Pro X1",
    orderId: "#VN-8401",
    date: "Jul 18, 2024",
    total: 189.99,
    status: "SHIPPED",
  },
  {
    id: "6",
    product: "Berry Blast 60ml",
    orderId: "#VN-8320",
    date: "Jul 02, 2024",
    total: 34.99,
    status: "SHIPPED",
  },
];

const STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  SHIPPED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  ACTIVE: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },
  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  PROCESSING: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
};

const ORDERS_PER_PAGE = 4;

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Profile form state
  const [phone, setPhone] = useState("+1 (720) 472-2498");
  const [address, setAddress] = useState(
    "2556 Sheridan Blvd, Denver, CO 80214"
  );

  // Filter orders by search
  const filteredOrders = STATIC_ORDERS.filter(
    (order) =>
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const getInitials = () => {
    if (!user) return "DK";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#CCFF00]" />
      </div>
    );
  }

  // Not authenticated - redirect prompt
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

  return (
    <div className="min-h-screen px-6 pt-10 pb-24 lg:px-12 animate-fadeIn">
      {/* ========== PROFILE CARD ========== */}
      <div className="relative overflow-hidden rounded-2xl border border-[#CCFF00]/10 bg-[#080808] p-6 lg:p-8">
        <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-[#CCFF00]/5 blur-3xl" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-[#CCFF00]/30 bg-[#0D0D0D] text-2xl font-black text-[#CCFF00]">
                {getInitials()}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#080808] bg-[#CCFF00]">
                <ShieldCheck size={10} className="text-black" />
              </div>
            </div>

            {/* Name + Email */}
            <div className="space-y-1">
              <h2 className="text-lg font-black tracking-wide text-white lg:text-xl">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail size={12} />
                <span className="text-xs">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Center: Phone + Address (in edit or display mode) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="space-y-1">
              <span className="block text-[8px] font-black tracking-[3px] text-[#CCFF00] uppercase">
                Phone Number
              </span>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-black px-3 py-1.5 text-xs text-white focus:border-[#CCFF00]/40 focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Phone size={12} className="text-zinc-500" />
                  {phone}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-white/5 bg-black px-3 py-1.5 text-xs text-white focus:border-[#CCFF00]/40 focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <MapPin size={12} className="text-zinc-500" />
                  {address}
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
      </div>

      {/* ========== ORDER HISTORY SECTION ========== */}
      <div className="mt-10">
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-black tracking-wider text-white uppercase">
            Order History
          </h3>

          {/* Search */}
          <div className="flex items-center rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-2.5 transition-all focus-within:border-[#CCFF00]/30">
            <Search size={14} className="shrink-0 text-zinc-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="ml-3 w-48 bg-transparent text-xs text-white placeholder-white/20 focus:outline-none"
            />
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

          {/* Order Rows */}
          {paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Package size={28} className="text-zinc-600" />
              <p className="text-xs font-bold text-zinc-500">
                No orders found.
              </p>
            </div>
          ) : (
            paginatedOrders.map((order, idx) => {
              const style = STATUS_STYLES[order.status];
              return (
                <div
                  key={order.id}
                  className={`group grid grid-cols-1 gap-4 px-6 py-5 transition-all duration-200 hover:bg-white/[0.02] lg:grid-cols-12 lg:items-center ${
                    idx < paginatedOrders.length - 1
                      ? "border-b border-white/5"
                      : ""
                  }`}
                >
                  {/* Product */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-[#0D0D0D] text-zinc-500">
                      <Package size={14} />
                    </div>
                    <span className="text-xs font-bold text-white">
                      {order.product}
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
                      {order.status}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex items-center justify-start lg:justify-end">
                    <button className="inline-flex items-center gap-1.5 text-[9px] font-black tracking-widest text-zinc-500 uppercase transition-all hover:text-[#CCFF00] group-hover:text-zinc-300">
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
        <div className="mt-6 flex items-center justify-between">
          <p className="text-[10px] text-zinc-500">
            Showing{" "}
            <span className="font-bold text-zinc-300">
              {paginatedOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-zinc-300">
              {filteredOrders.length}
            </span>{" "}
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
      </div>
    </div>
  );
}
