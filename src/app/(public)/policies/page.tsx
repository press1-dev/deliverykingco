"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Scale,
  Truck,
  HelpCircle,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "privacy" | "terms" | "shipping";

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("privacy");

  return (
    <div className="min-h-screen bg-black pt-16 pb-24 text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="container mx-auto max-w-[1250px] px-6 lg:px-12">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Sidebar Navigation (3 Cols) */}
          <div className="w-full space-y-6 lg:sticky lg:top-28 lg:col-span-3">
            {/* Sidebar Title */}
            <div className="flex items-center gap-3 border-l-4 border-[#CCFF00] py-1 pl-4">
              <h2 className="text-sm font-black tracking-widest text-white uppercase">
                Policies & Info
              </h2>
            </div>

            {/* Sidebar Navigation Options (Clean vertical stack on all viewports) */}
            <div className="flex w-full flex-col gap-2 rounded-2xl border border-white/5 bg-[#080808] p-2">
              <button
                onClick={() => setActiveTab("privacy")}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-xs font-black tracking-wider uppercase transition-all duration-300",
                  activeTab === "privacy"
                    ? "border border-[#CCFF00]/20 bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "border border-transparent text-zinc-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Lock size={15} />
                Privacy Policy
              </button>

              <button
                onClick={() => setActiveTab("terms")}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-xs font-black tracking-wider uppercase transition-all duration-300",
                  activeTab === "terms"
                    ? "border border-[#CCFF00]/20 bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "border border-transparent text-zinc-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Scale size={15} />
                Terms of Service
              </button>

              <button
                onClick={() => setActiveTab("shipping")}
                className={cn(
                  "flex w-full items-center justify-start gap-3 rounded-xl px-4 py-3 text-xs font-black tracking-wider uppercase transition-all duration-300",
                  activeTab === "shipping"
                    ? "border border-[#CCFF00]/20 bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "border border-transparent text-zinc-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <Truck size={15} />
                Shipping & Returns
              </button>
            </div>

            {/* Need Help? glowing neon card (Desktop Only inside sidebar) */}
            <div className="relative hidden space-y-4 overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0D] p-6 lg:block">
              <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 rounded-full bg-[#CCFF00]/10 blur-xl" />

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CCFF00]/10">
                <HelpCircle size={18} className="text-[#CCFF00]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black tracking-wider text-white uppercase">
                  Need Help?
                </h3>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  Questions about our legal terms? Our support team is available
                  24/7 to assist.
                </p>
              </div>

              <a
                href="mailto:support@deliveryking.co"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-3 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98]"
              >
                Contact Support
              </a>
            </div>
          </div>

          {/* Right Content Area (9 Cols) */}
          <div className="space-y-6 lg:col-span-9">
            {/* PRIVACY POLICY TAB CONTENT */}
            {activeTab === "privacy" && (
              <div className="animate-fadeIn space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-5xl leading-none font-black tracking-tighter text-white uppercase">
                    Privacy
                  </h1>
                  <h1 className="mt-1 text-5xl leading-none font-black tracking-tighter text-[#CCFF00] uppercase">
                    Policy
                  </h1>
                  <p className="mt-4 text-xs font-bold tracking-wider text-white/40 uppercase">
                    Last Updated: October 24, 2024
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    At Delivery King, we value your privacy. This Privacy Policy
                    describes how we collect, use, and protect your personal
                    information when you visit our store or use our delivery
                    services.
                  </p>
                </div>

                {/* Section 01 */}
                <div className="space-y-6">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">01.</span> Information We
                    Collect
                  </h2>

                  {/* Info Cards Grid */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Card 1 */}
                    <div className="space-y-2 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <span className="block text-[9px] font-black tracking-[1.5px] text-[#CCFF00] uppercase">
                        Personal Identifiers
                      </span>
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        Name, billing address, shipping address, email address,
                        and phone number.
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="space-y-2 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <span className="block text-[9px] font-black tracking-[1.5px] text-[#CCFF00] uppercase">
                        Age Verification Data
                      </span>
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        To comply with Colorado and Federal law, we may collect
                        date of birth or government-issued ID information to
                        verify you are 21 or older.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="space-y-2 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <span className="block text-[9px] font-black tracking-[1.5px] text-[#CCFF00] uppercase">
                        Payment Information
                      </span>
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        Credit card numbers or other payment details (processed
                        securely via our third-party payment processors).
                      </p>
                    </div>

                    {/* Card 4 */}
                    <div className="space-y-2 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <span className="block text-[9px] font-black tracking-[1.5px] text-[#CCFF00] uppercase">
                        Device Information
                      </span>
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        IP address, browser type, and cookies to improve your
                        browsing experience.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 02 */}
                <div className="space-y-6">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">02.</span> How We Use Your
                    Information
                  </h2>

                  <div className="space-y-4 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <div className="flex gap-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/10">
                        <CheckCircle2 size={12} className="text-[#CCFF00]" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-black tracking-wide text-white uppercase">
                          Order Fulfillment
                        </h4>
                        <p className="text-[11px] leading-relaxed text-zinc-300">
                          To process payments, arrange shipping, and facilitate
                          local deliveries.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-white/5 pt-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/10">
                        <ShieldCheck size={12} className="text-[#CCFF00]" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-black tracking-wide text-white uppercase">
                          Compliance
                        </h4>
                        <p className="text-[11px] leading-relaxed text-zinc-300">
                          To verify your age and ensure we are following tobacco
                          and vaporizer retail laws.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-white/5 pt-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/10">
                        <FileText size={12} className="text-[#CCFF00]" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-black tracking-wide text-white uppercase">
                          Communication
                        </h4>
                        <p className="text-[11px] leading-relaxed text-zinc-300">
                          To send order updates, respond to customer service
                          inquiries, or send marketing materials (if you have
                          opted in).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 border-t border-white/5 pt-4">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/10">
                        <Lock size={12} className="text-[#CCFF00]" />
                      </div>
                      <div>
                        <h4 className="mb-1 text-xs font-black tracking-wide text-white uppercase">
                          Security
                        </h4>
                        <p className="text-[11px] leading-relaxed text-zinc-300">
                          To detect and prevent fraudulent transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 03 */}
                <div className="space-y-6">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">03.</span> Sharing Your
                    Information
                  </h2>

                  <div className="space-y-4 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <p className="mb-2 text-[11px] leading-relaxed text-zinc-300">
                      We do not sell your personal data. We only share
                      information with third parties in the following cases:
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-xs font-bold text-white uppercase">
                          Service Providers
                        </span>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">
                          With delivery drivers, shipping carriers (USPS, UPS),
                          & processors
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-white/5 py-2">
                        <span className="text-xs font-bold text-white uppercase">
                          Age Verification
                        </span>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">
                          To confirm legal age before shipping restricted items
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-bold text-white uppercase">
                          Legal Requirements
                        </span>
                        <span className="text-[10px] font-bold text-zinc-300 uppercase">
                          If required by subpoena, law, or to protect Delivery
                          King rights
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 04 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">04.</span> Cookies and
                      Tracking
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        Our website uses cookies to remember your cart and
                        analyze site traffic. You can choose to disable cookies
                        in your browser settings, though some features of our
                        website may not function properly as a result.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">05.</span> Data Security
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        We implement a variety of security measures to maintain
                        the safety of your personal information. Your sensitive
                        data (payment info and ID verification) is encrypted and
                        transmitted via Secure Socket Layer (SSL) technology.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 06 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">06.</span> Your Rights
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <ul className="list-disc space-y-2 pl-4 text-[11px] leading-relaxed text-zinc-300">
                        <li>
                          Request access to the personal data we hold about you.
                        </li>
                        <li>
                          Request that we correct or delete your personal
                          information.
                        </li>
                        <li>
                          Opt-out of marketing communications at any time.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">07.</span> Changes &
                      Contact
                    </h2>
                    <div className="space-y-2 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        We may update this Privacy Policy from time to time. Any
                        changes will be posted on this page.
                      </p>
                      <p className="mt-2 border-t border-white/5 pt-2 text-[11px] leading-relaxed font-bold text-zinc-300">
                        Delivery King 2556 Sheridan Blvd, Denver, CO 80214 (720)
                        472-2498
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TERMS OF SERVICE TAB CONTENT */}
            {activeTab === "terms" && (
              <div className="animate-fadeIn space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-5xl leading-none font-black tracking-tighter text-white uppercase">
                    Terms Of
                  </h1>
                  <h1 className="mt-1 text-5xl leading-none font-black tracking-tighter text-[#CCFF00] uppercase">
                    Service
                  </h1>
                  <p className="mt-4 text-xs font-bold tracking-wider text-white/40 uppercase">
                    Last Updated: October 24, 2024
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    Welcome to Delivery King. These Terms and Conditions govern
                    your use of our website and the purchase of any products
                    from our store. By accessing our services, you agree to
                    comply with the following terms.
                  </p>
                </div>

                {/* Section 01 */}
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">01.</span> Age Verification
                    & Compliance
                  </h2>
                  <div className="space-y-3 rounded-xl border border-[#CCFF00]/10 bg-[#CCFF00]/5 p-6">
                    <div className="flex items-center gap-2 text-[#CCFF00]">
                      <AlertTriangle size={16} />
                      <h4 className="text-xs font-black tracking-wider uppercase">
                        Legal Age Requirement (21+)
                      </h4>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-300">
                      In accordance with federal and Colorado state law, you
                      must be at least 21 years of age to purchase any vaporizer
                      products, accessories, or nicotine-containing items. We
                      reserve the right to use third-party age verification
                      services and deny service if age cannot be verified.
                    </p>
                    <p className="border-t border-[#CCFF00]/10 pt-2 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Product Use:</strong> All products sold by
                      Delivery King are intended for legal use only. By
                      purchasing, you agree not to use these products for any
                      illegal or unauthorized purposes.
                    </p>
                  </div>
                </div>

                {/* Section 02 */}
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">02.</span> Local Delivery &
                    On-Site Inspection
                  </h2>
                  <div className="space-y-3 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <p className="text-[11px] leading-relaxed text-zinc-300">
                      <strong>Finality of Delivery:</strong> For all local
                      delivery orders, it is the customer&apos;s responsibility
                      to check the item thoroughly before the delivery driver
                      leaves the site.
                    </p>
                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Acceptance of Goods:</strong> Once the driver
                      leaves the premises, Delivery King assumes all items were
                      delivered correctly and in perfect condition. No claims
                      for physical damage or missing items will be accepted
                      after this point.
                    </p>
                  </div>
                </div>

                {/* Section 03 */}
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">03.</span> Shipping &
                    Returns
                  </h2>
                  <div className="space-y-4 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <p className="text-[11px] leading-relaxed text-zinc-300">
                      <strong>Local Delivery:</strong> For all local delivery
                      orders, customers are required to inspect their items
                      before the delivery driver leaves the site. Once the
                      driver has departed the premises, it is documented and
                      assumed that the correct items were delivered in perfect
                      condition.
                    </p>
                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Defective Returns:</strong> You may return
                      defective items within 30 days of delivery for a full
                      refund or exchange. We will cover return shipping costs
                      only if the return is a result of our error (e.g.,
                      incorrect or defective item).
                    </p>
                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Refund Processing:</strong> Refunds are typically
                      issued within four weeks of the package being handed to
                      the return shipper. This timeline accounts for transit
                      (5–10 business days), our internal inspection (3–5
                      business days), and bank processing (5–10 business days).
                    </p>
                  </div>
                </div>

                {/* Section 04 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-4 md:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">04.</span> Shipping Rates
                      & Estimates
                    </h2>
                    <div className="space-y-3 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        <strong>Weight-Based Pricing:</strong> Shipping rates
                        are calculated by weight and rounded up to the nearest
                        full pound, following standard carrier policies.
                      </p>
                      <p className="border-t border-white/5 pt-2 text-[11px] leading-relaxed text-zinc-300">
                        <strong>Delivery Dates:</strong> Any shipping dates
                        provided are estimates and are not guaranteed. We are
                        not liable for delays caused by third-party shipping
                        providers.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">05.</span> Governing Law
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        These terms are governed by and construed in accordance
                        with the laws of the State of Colorado. Any disputes
                        relating to these terms will be subject to Denver
                        courts.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 06 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">06.</span> Liability
                      Limits
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        Delivery King shall not be liable for any health-related
                        issues, property damage, or financial loss resulting
                        from the use or misuse of products purchased from our
                        store. Use of all vaporizer equipment is at the
                        user&apos;s own risk.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                      <span className="text-[#CCFF00]">07.</span> Legal
                      Inquiries
                    </h2>
                    <div className="rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
                      <p className="text-[11px] leading-relaxed text-zinc-300">
                        For returns or questions regarding these terms, please
                        contact us with your order number at:
                      </p>
                      <p className="mt-2 border-t border-white/5 pt-2 text-[11px] leading-relaxed font-bold text-zinc-300">
                        Delivery King 2556 Sheridan Blvd, Denver, CO 80214 (720)
                        472-2498
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SHIPPING INFO TAB CONTENT */}
            {activeTab === "shipping" && (
              <div className="animate-fadeIn space-y-8">
                {/* Header */}
                <div>
                  <h1 className="text-5xl leading-none font-black tracking-tighter text-white uppercase">
                    Shipping
                  </h1>
                  <h1 className="mt-1 text-5xl leading-none font-black tracking-tighter text-[#CCFF00] uppercase">
                    & Returns
                  </h1>
                  <p className="mt-4 text-xs font-bold tracking-wider text-white/40 uppercase">
                    Last Updated: October 24, 2024
                  </p>
                </div>

                <div className="space-y-3 rounded-xl border border-[#CCFF00]/10 bg-[#CCFF00]/5 p-6">
                  <div className="flex items-center gap-2 text-[#CCFF00]">
                    <Info size={16} />
                    <h4 className="text-xs font-black tracking-wider uppercase">
                      Local Shipping & Handover Notice
                    </h4>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-300">
                    Please review our shipping policies and returns procedures
                    below for both local delivery and pickup orders.
                  </p>
                </div>

                {/* Section 01 */}
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">01.</span> Returns Policy
                  </h2>
                  <div className="space-y-4 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <p className="text-[11px] leading-relaxed text-zinc-300">
                      <strong>Local Delivery & Pickup:</strong> Please inspect
                      your items thoroughly before the delivery driver leaves
                      your location or before you leave the pickup site. Once
                      the driver departs the premises or the handover is
                      complete, we consider the order fulfilled with the correct
                      items delivered in perfect condition.
                    </p>

                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Defective Items:</strong> You may return defective
                      items within 30 days of receipt for a full refund or
                      exchange. We will handle the logistics or costs associated
                      with the return if the error is on our part (e.g., you
                      received an incorrect or defective item).
                    </p>

                    <div className="space-y-2 border-t border-white/5 pt-4">
                      <span className="block text-[10px] font-bold text-white uppercase">
                        Refund Timeline (Up to 4 weeks total):
                      </span>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-lg border border-white/5 bg-black p-3">
                          <span className="mb-1 block text-[9px] font-black tracking-wider text-[#CCFF00] uppercase">
                            01. Transit
                          </span>
                          <span className="block text-xs font-black text-white">
                            5 - 10 Business Days
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-black p-3">
                          <span className="mb-1 block text-[9px] font-black tracking-wider text-[#CCFF00] uppercase">
                            02. Inspection
                          </span>
                          <span className="block text-xs font-black text-white">
                            3 - 5 Business Days
                          </span>
                        </div>
                        <div className="rounded-lg border border-white/5 bg-black p-3">
                          <span className="mb-1 block text-[9px] font-black tracking-wider text-[#CCFF00] uppercase">
                            03. Bank Process
                          </span>
                          <span className="block text-xs font-black text-white">
                            5 - 10 Business Days
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>How to Start a Return:</strong> If you need to
                      return an item, please Contact Us with your order number
                      and product details. We will respond promptly with
                      instructions on how to proceed.
                    </p>
                  </div>
                </div>

                {/* Section 02 */}
                <div className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                    <span className="text-[#CCFF00]">02.</span> Local Shipping &
                    Delivery
                  </h2>
                  <div className="space-y-4 rounded-xl border border-white/5 bg-[#0D0D0D] p-6">
                    <p className="text-[11px] leading-relaxed text-zinc-300">
                      <strong>Service Area:</strong> Please note that we operate
                      strictly as a local service. We do not offer international
                      or long-distance global shipping at this time. We focus
                      our delivery efforts within our designated local zones to
                      ensure the highest quality of service.
                    </p>

                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Delivery Estimates:</strong> When you place a
                      local order, we will provide estimated delivery dates
                      based on item availability and your specific location.
                      These estimates will be visible during the checkout
                      process.
                    </p>

                    <p className="border-t border-white/5 pt-3 text-[11px] leading-relaxed text-zinc-300">
                      <strong>Weight-Based Rates:</strong> Shipping and delivery
                      rates are calculated based on the total weight of your
                      order. You can find the weight of any item on its specific
                      detail page. Note: To align with our local courier
                      standards, all weights are rounded up to the next full
                      pound for billing purposes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile-only Need Help? Card at the bottom of the content */}
            <div className="relative mt-12 space-y-4 overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0D] p-6 lg:hidden">
              <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 rounded-full bg-[#CCFF00]/10 blur-xl" />

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CCFF00]/10">
                <HelpCircle size={18} className="text-[#CCFF00]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-black tracking-wider text-white uppercase">
                  Need Help?
                </h3>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  Questions about our legal terms? Our support team is available
                  24/7 to assist.
                </p>
              </div>

              <a
                href="mailto:support@deliveryking.co"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-3 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98]"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
