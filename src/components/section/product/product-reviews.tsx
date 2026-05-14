import { Star, Edit3 } from "lucide-react";
import Image from "next/image";

interface ReviewProps {
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
}

function ReviewCard({ author, rating, date, content, avatar }: ReviewProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#111111]/50 p-6 transition-all hover:bg-[#111111]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#CCFF00]">
            {avatar ? (
              <Image src={avatar} alt={author} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-black text-black">
                {author.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase">{author}</h4>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < rating ? "fill-[#CCFF00] text-[#CCFF00]" : "text-white/10"}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold text-white/20 uppercase">{date}</span>
      </div>
      <p className="text-sm leading-relaxed text-[#C4C9AC]">&quot;{content}&quot;</p>
    </div>
  );
}

export function ProductReviews() {
  const reviews = [
    {
      author: "James R.",
      rating: 5,
      date: "2 Weeks Ago",
      content: "Best kit I've owned in years. The flavor is incredibly crisp compared to my old G2. The carbon fiber finish feels super premium in hand. Highly recommended for heavy users.",
    },
    {
      author: "Sarah M.",
      rating: 5,
      date: "1 Month Ago",
      content: "The battery life is insane. I can go 2 full days without charging, and when I do, it's done in 20 minutes. Totally worth every penny if you pay for that huge battery capacity.",
    },
    {
      author: "Michael T.",
      rating: 5,
      date: "3 Weeks Ago",
      content: "Ordered Tuesday, arrived Thursday. Packaging was top tier. The G3 is a beast, clouds are massive and the Nexus Mint Blast is my new favorite flavor. 10/10.",
    },
  ];

  return (
    <section className="mt-20">
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 w-1 bg-[#CCFF00]" />
          <h2 className="text-xl font-black tracking-widest text-white uppercase">
            Verified Reviews
          </h2>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#CCFF00] uppercase transition-colors hover:text-white">
          Write a Review <Edit3 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {reviews.map((review, i) => (
          <ReviewCard key={i} {...review} />
        ))}
      </div>
    </section>
  );
}
