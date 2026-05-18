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
    { name: "Shop All Products", href: "/shop" },
    { name: "Our Brands", href: "/brands" },
    { name: "Contact Team", href: "/contact" },
    { name: "Policies & Info", href: "/policies" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/policies?tab=privacy" },
    { name: "Terms & Conditions", href: "/policies?tab=terms" },
    { name: "Shipping & Returns", href: "/policies?tab=shipping" },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t-[6px] border-[#CCFF00] bg-black text-[#E4E1E6]">
      <div className="container mx-auto px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 animate-fadeIn">
            <Link href="/" className="inline-block">
              <h2 className="font-heading text-2xl font-black uppercase tracking-tighter text-[#CCFF00] lg:text-3xl">
                Delivery King
              </h2>
            </Link>
            <p className="mt-6 max-w-xs font-body text-xs leading-relaxed text-zinc-300">
              The premium destination for local vaping enthusiasts. We prioritize safety, speed, and peerless quality in every order we deliver.
            </p>
            
            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-5">
              <a 
                href="https://deliverykingco.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-zinc-300 transition-colors hover:text-[#CCFF00]"
              >
                <Globe size={18} />
              </a>
              <Link href="/contact" className="text-zinc-300 transition-colors hover:text-[#CCFF00]">
                <Share2 size={18} />
              </Link>
              <a 
                href="mailto:hello@deliverykingco.com" 
                className="text-zinc-300 transition-colors hover:text-[#CCFF00]"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-xs font-black uppercase tracking-[2px] text-white">
              Navigation
            </h3>
            <ul className="mt-6 space-y-4">
              {FOOTER_LINKS.navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="font-body text-xs text-zinc-300 transition-colors hover:text-[#CCFF00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-xs font-black uppercase tracking-[2px] text-white">
              Legal Info
            </h3>
            <ul className="mt-6 space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="font-body text-xs text-zinc-300 transition-colors hover:text-[#CCFF00]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4">
            <h3 className="font-heading text-xs font-black uppercase tracking-[2px] text-white">
              Stay Connected
            </h3>
            <p className="mt-6 font-body text-xs text-zinc-300">
              Sign up to receive exclusive offers and direct delivery updates.
            </p>
            
            <form 
              className="mt-6 flex w-full max-w-md items-stretch"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white placeholder-white/20 outline-none transition-colors focus:border-[#CCFF00]/40"
                required
              />
              <button
                type="submit"
                className="group flex w-[54px] items-center justify-center bg-[#CCFF00] text-black transition-all hover:bg-[#b3e600]"
                aria-label="Subscribe"
              >
                <Send size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar Disclaimer */}
      <div className="border-t border-white/5 bg-[#050505] py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-8 px-6 lg:flex-row lg:px-12">
          
          <div className="flex flex-col gap-2">
            <p className="text-center font-body text-[10px] font-black uppercase tracking-[2px] text-white/40 lg:text-left">
              © 2026 DELIVERY KING. ALL RIGHTS RESERVED.
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
