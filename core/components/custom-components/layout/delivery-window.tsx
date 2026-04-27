import { Car, Truck, Zap } from "lucide-react";

export function DeliveryWindow() {
    return (
        <div className="flex items-center justify-center font-heading bg-[#9D05FF] h-[40px] text-[#F7E6FF] ">
            <div className="flex items-center space-x-6">
                <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <h3 className="font-bold  text-[14px]">Free Delivery for Orders over $50. Hours: 9AM-9PM MDT. $2.99 delivery fee for orders below $50.</h3>
                </div>
                <span className=" text-[18px]">|</span>

                <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <p className="font-bold  text-[14px]">1 HOUR DELIVERY WINDOW</p>
                </div>
            </div>
        </div>
    )
}