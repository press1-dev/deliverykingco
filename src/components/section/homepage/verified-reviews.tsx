import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  initials: string;
  text: string;
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "James D.",
    initials: "JD",
    text: "The shipping was incredibly fast, and the Titan V3 mod is hands down the best device I've ever owned. The flavor depth is unmatched.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah L.",
    initials: "SL",
    text: "Void Nectar is my new all-day vape. I love the artisan quality and the complexity of the flavors. Fast delivery and great support!",
    rating: 5,
  },
  {
    id: 3,
    name: "Marcus K.",
    initials: "MK",
    text: "Finally a vape shop that cares about quality over quantity. The selection of brands here is top-tier. Customer service is 10/10.",
    rating: 5,
  },
];

export function VerifiedReviews() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="group flex flex-col justify-between border-l-4 border-[#CCFF00] bg-[#0A0A0A] p-8 transition-all duration-300 hover:bg-[#111111] hover:shadow-2xl hover:shadow-[#CCFF00]/5">
      <div className="space-y-6">
        {/* Rating */}
        <div className="flex gap-1.5">
          {[...Array(review.rating)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className="fill-[#CCFF00] text-[#CCFF00] transition-transform duration-300 group-hover:scale-110"
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="font-body text-[17px] italic leading-[1.6] text-[#E4E1E6] antialiased">
          &quot;{review.text}&quot;
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-10 flex items-center gap-4 border-t border-white/5 pt-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1A1A1A] font-heading text-sm font-bold text-[#CCFF00] transition-colors group-hover:bg-[#222222]">
          {review.initials}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-heading text-sm font-bold uppercase tracking-wider text-[#E4E1E6]">
            {review.name}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#C4C9AC]/60">
            Verified Buyer
          </span>
        </div>
      </div>
    </div>
  );
}
