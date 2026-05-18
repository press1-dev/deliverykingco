"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate premium submission response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-24 text-white selection:bg-[#CCFF00] selection:text-black">
      <div className="animate-fadeIn container mx-auto max-w-[1200px] px-6 lg:px-12">
        {/* Page Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 border-l-4 border-[#CCFF00] py-1 pl-4">
            <span className="text-xs font-black tracking-widest text-[#CCFF00] uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl leading-none font-black tracking-tighter text-white uppercase sm:text-6xl">
            Contact
          </h1>
          <h1 className="mt-1 text-5xl leading-none font-black tracking-tighter text-[#CCFF00] uppercase sm:text-6xl">
            Delivery King
          </h1>
          <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-zinc-300">
            Have questions about orders, deliveries, or products? Our Denver
            team is on standby between 9 AM and 9 PM to get you exactly what you
            need.
          </p>
        </div>

        {/* Main Columns Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Info Columns (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            {/* Hour Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#CCFF00]/10 bg-[#CCFF00]/5 p-6">
              <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-full bg-[#CCFF00]/10 blur-xl" />
              <div className="flex gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/20 text-[#CCFF00]">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-black tracking-wider text-white uppercase">
                    Delivery Hours
                  </h4>
                  <p className="text-[13px] font-black text-[#CCFF00]">
                    9:00 AM - 9:00 PM MDT
                  </p>
                  <p className="mt-2 text-[10px] leading-relaxed text-zinc-300">
                    Free delivery for local orders over $50. Rapid 1-hour
                    delivery window in designated service zones!
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards List */}
            <div className="space-y-4 rounded-2xl border border-white/5 bg-[#080808] p-6">
              <h3 className="mb-4 border-b border-white/5 pb-4 text-xs font-black tracking-widest text-white uppercase">
                Support Channels
              </h3>

              {/* Channel 1: Phone */}
              <a
                href="tel:7204722498"
                className="group flex gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-white/5 hover:bg-[#0D0D0D]"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-all duration-300 group-hover:bg-[#CCFF00]/10 group-hover:text-[#CCFF00]">
                  <Phone size={14} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-white/40 uppercase transition-all duration-300 group-hover:text-white">
                    Call Support
                  </h4>
                  <p className="mt-0.5 text-sm font-black text-white transition-all duration-300 group-hover:text-[#CCFF00]">
                    (720) 472-2498
                  </p>
                  <p className="mt-1 text-[9px] text-zinc-400">
                    Fast voice support during retail hours.
                  </p>
                </div>
              </a>

              {/* Channel 2: Email */}
              <a
                href="mailto:hello@deliverykingco.com"
                className="group flex gap-4 rounded-xl border border-transparent p-4 transition-all duration-300 hover:border-white/5 hover:bg-[#0D0D0D]"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-all duration-300 group-hover:bg-[#CCFF00]/10 group-hover:text-[#CCFF00]">
                  <Mail size={14} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-white/40 uppercase transition-all duration-300 group-hover:text-white">
                    Email Inquiries
                  </h4>
                  <p className="mt-0.5 text-sm font-black text-white transition-all duration-300 group-hover:text-[#CCFF00]">
                    hello@deliverykingco.com
                  </p>
                  <p className="mt-1 text-[9px] text-zinc-400">
                    Checked constantly throughout delivery windows.
                  </p>
                </div>
              </a>

              {/* Channel 3: Address */}
              <div className="flex gap-4 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-zinc-300">
                  <MapPin size={14} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black tracking-wider text-white/40 uppercase">
                    Our HQ
                  </h4>
                  <p className="mt-0.5 text-xs font-black text-white">
                    2556 Sheridan Blvd
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    Denver, CO 80214
                  </p>
                </div>
              </div>
            </div>

            {/* Note banner */}
            <div className="flex gap-3 rounded-xl border border-white/5 bg-[#0D0D0D] p-5">
              <div className="mt-0.5 shrink-0 text-[#CCFF00]">
                <Info size={14} />
              </div>
              <p className="text-[9.5px] leading-relaxed text-zinc-300">
                <strong>Age Restricted Products:</strong> Delivery drivers will
                strictly perform government-issued ID checks at the handover
                location. Receivers must be 21+ with zero exceptions.
              </p>
            </div>
          </div>

          {/* Right Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080808] p-8">
              <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#CCFF00]/5 blur-2xl" />

              <h2 className="mb-6 flex items-center gap-2 text-lg font-black tracking-wider text-white uppercase">
                <MessageSquare size={16} className="text-[#CCFF00]" />
                Send A Message
              </h2>

              {isSuccess ? (
                <div className="animate-scaleUp space-y-6 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFF00]/10 text-[#CCFF00]">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black tracking-wider text-white uppercase">
                      Message Sent Successfully!
                    </h3>
                    <p className="mx-auto max-w-sm text-[11px] leading-relaxed text-zinc-300">
                      Thank you for contacting Delivery King. A Denver
                      representative will get back to you shortly via the email
                      or phone number provided.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all duration-300 hover:bg-white/10 active:scale-[0.98]"
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black tracking-widest text-white/40 uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/40 focus:outline-none"
                    />
                  </div>

                  {/* Contact Fields Grid */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black tracking-widest text-white/40 uppercase">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/40 focus:outline-none"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black tracking-widest text-white/40 uppercase">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="(720) 472-2498"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/40 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black tracking-widest text-white/40 uppercase">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full appearance-none rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/40 focus:outline-none"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="delivery">Delivery Assistance</option>
                      <option value="billing">Billing & Refund</option>
                      <option value="partnerships">Brand Partnership</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black tracking-widest text-white/40 uppercase">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us what you need help with..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-white/5 bg-[#0D0D0D] px-4 py-3 text-xs text-white placeholder-white/20 transition-all duration-300 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/40 focus:outline-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#CCFF00] py-4 text-xs font-black tracking-widest text-black uppercase transition-all duration-300 hover:bg-[#b3e600] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
