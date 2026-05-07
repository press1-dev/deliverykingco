import Image from "next/image";
import { Button } from "../ui/button";

export default function BestSellerCard() {
  return (
    <div className="flex flex-col gap-y-3 rounded-sm border border-white/5 bg-[#1B1B1E] p-3">
      {/* Image */}
      <div className="relative flex w-full items-center justify-center overflow-hidden rounded-sm">
        <Image
          src="/products/productImg-1.jpg"
          width={500}
          height={500}
          alt="product"
          className="rounded-sm object-cover"
          priority
        />
      </div>

      {/* Containt Contatiner */}
      <div className="mt-2 space-y-2">
        {/* Product Title */}
        <h3 className="line-clamp-1 text-center text-base uppercase">
          Titan V3 MOD
        </h3>

        {/* Pricing */}
        <p className="text-center text-base font-bold text-[#CCFF00]">$40.00</p>

        {/* Button */}
        <Button size={"small"} className="w-full opacity-70">
          Add To Cart
        </Button>
      </div>
    </div>
  );
}
