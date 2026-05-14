import { Truck, Zap } from "lucide-react";

export function DeliveryWindow() {
  return (
    <div className="font-heading flex min-h-[40px] items-center justify-center bg-[#b4e600e2] px-4 py-2 text-black">
      <div className="flex flex-col items-center gap-2 text-center md:flex-row md:gap-6">
        <div className="flex items-center justify-center gap-2">
          <Truck className="h-4 w-4 shrink-0" />
          <h3 className="text-[12px] leading-tight font-bold md:text-[14px]">
            Free Delivery over $50. Hours: 9AM-9PM MDT.
          </h3>
        </div>

        <span className="hidden text-[18px] md:inline">|</span>

        <div className="flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 shrink-0" />
          <p className="text-[12px] font-bold uppercase md:text-[14px]">
            1 HOUR DELIVERY WINDOW
          </p>
        </div>
      </div>
    </div>
  );
}
