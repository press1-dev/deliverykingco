"use client";

import Link from "next/link";
import { 
  Globe, 
  Share2, 
  Mail, 
  Send, 
  CreditCard, 
  Landmark, 
  Wallet 
} from "lucide-react";

const FOOTER_LINKS = {
  navigation: [
    { name: "Shop All", href: "/shop" },
    { name: "Liquid Lab", href: "/liquid-lab" },
    { name: "New Releases", href: "/new-releases" },
    { name: "Best Sellers", href: "/best-sellers" },
  ],
  legal: [
    { name: "Age Policy", href: "/age-policy" },
    { name: "Shipping & Returns", href: "/shipping-returns" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t-[6px] border-[#CCFF00] bg-black text-[#E4E1E6]">
      <div className="container mx-auto px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block">
              <h2 className="font-heading text-2xl font-black uppercase tracking-tighter text-[#CCFF00] lg:text-3xl">
                Delivery King
              </h2>
            </Link>
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-[#C4C9AC]">
              The premium destination for vaping enthusiasts. We prioritize safety, quality, and performance in every product we curate.
            </p>
            
            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-5">
              <Link href="#" className="text-[#C4C9AC] transition-colors hover:text-[#CCFF00]">
                <Globe size={20} />
              </Link>
              <Link href="#" className="text-[#C4C9AC] transition-colors hover:text-[#CCFF00]">
                <Share2 size={20} />
              </Link>
              <Link href="#" className="text-[#C4C9AC] transition-colors hover:text-[#CCFF00]">
                <Mail size={20} />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[2.4px] text-white">
              Navigation
            </h3>
            <ul className="mt-6 space-y-4">
              {FOOTER_LINKS.navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="font-body text-sm text-[#C4C9AC] transition-colors hover:text-[#CCFF00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[2.4px] text-white">
              Legal
            </h3>
            <ul className="mt-6 space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="font-body text-sm text-[#C4C9AC] transition-colors hover:text-[#CCFF00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[2.4px] text-white">
              Stay Connected
            </h3>
            <p className="mt-6 font-body text-sm text-[#C4C9AC]">
              Sign up for exclusive content and nexus updates.
            </p>
            
            <form 
              className="mt-6 flex w-full max-w-md items-stretch"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email"
                className="flex-1 border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#CCFF00]/50"
                required
              />
              <button
                type="submit"
                className="group flex w-[54px] items-center justify-center bg-[#CCFF00] text-black transition-all hover:bg-[#b3e600]"
                aria-label="Subscribe"
              >
                <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar Disclaimer */}
      <div className="border-t border-white/5 bg-[#050505] py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 lg:flex-row lg:px-12">
          
          <div className="flex flex-col gap-2">
            <p className="text-center font-body text-[10px] font-bold uppercase tracking-[2px] text-white/40 lg:text-left">
              © 2026 VAPE NEXUS. ALL RIGHTS RESERVED.
            </p>
            <p className="text-center font-body text-[10px] font-black uppercase tracking-[2px] text-[#CCFF00]/80 lg:text-left">
              NICOTINE IS AN ADDICTIVE CHEMICAL. 21+ ONLY.
            </p>
          </div>

          <div className="flex items-center gap-8 text-white/20">
            <div className="group cursor-pointer transition-colors hover:text-[#CCFF00]">
              <CreditCard size={20} />
            </div>
            <div className="group cursor-pointer transition-colors hover:text-[#CCFF00]">
              <Landmark size={20} />
            </div>
            <div className="group cursor-pointer transition-colors hover:text-[#CCFF00]">
              <Wallet size={20} />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
