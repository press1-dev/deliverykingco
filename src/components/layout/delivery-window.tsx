import { Truck, Zap } from "lucide-react";

export function DeliveryWindow() {
  return (
    <div className="flex items-center justify-center font-heading bg-[#9D05FF] min-h-[40px] py-2 text-[#F7E6FF] px-4">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <Truck className="w-4 h-4 shrink-0" />
          <h3 className="font-bold text-[12px] md:text-[14px] leading-tight">
            Free Delivery over $50. Hours: 9AM-9PM MDT.
          </h3>
        </div>

        <span className="hidden md:inline text-[18px]">|</span>

        <div className="flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 shrink-0" />
          <p className="font-bold text-[12px] md:text-[14px] uppercase">
            1 HOUR DELIVERY WINDOW
          </p>
        </div>
      </div>
    </div>
  );
}
