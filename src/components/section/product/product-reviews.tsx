import { Star, Edit3 } from "lucide-react";

export type ReviewData = {
  title?: string;
  text: string;
  rating: number;
  author: { name: string };
  createdAt?: { utc: string };
};

interface ProductReviewsProps {
  reviews: ReviewData[];
}

function ReviewCard({ author, rating, text, title }: ReviewData) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#111111]/50 p-6 transition-all hover:bg-[#111111]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#CCFF00] text-sm font-black text-black">
            {author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase">
              {author.name}
            </h4>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={
                    i < rating
                      ? "fill-[#CCFF00] text-[#CCFF00]"
                      : "text-white/10"
                  }
                />
              ))}
            </div>
          </div>
        </div>
        {title && (
          <span className="max-w-[120px] truncate text-[10px] font-bold text-white/40 uppercase">
            {title}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-[#C4C9AC]">
        &quot;{text}&quot;
      </p>
    </div>
  );
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <section className="mt-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 w-1 bg-[#CCFF00]" />
          <h2 className="text-xl font-black tracking-widest text-white uppercase">
            Verified Reviews
          </h2>
        </div>
        <button className="flex cursor-pointer items-center gap-2 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase transition-colors hover:text-white">
          Write a Review <Edit3 size={14} />
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#080808] px-6 py-16 text-center">
          <div className="mb-4 flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-white/10" />
            ))}
          </div>
          <h3 className="text-base font-bold tracking-wider text-white uppercase">
            No Reviews Yet
          </h3>
          <p className="mt-2 max-w-sm text-xs text-[#C4C9AC]">
            There are currently no reviews from live buyers for this product. Be
            the first to share your premium experience with others!
          </p>
          <button className="mt-6 cursor-pointer rounded-xl bg-[#CCFF00] px-6 py-2.5 text-[10px] font-black tracking-widest text-black uppercase transition-all hover:bg-[#b3e600]">
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </div>
      )}
    </section>
  );
}
