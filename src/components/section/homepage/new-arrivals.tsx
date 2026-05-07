import Image from "next/image";

export const NewArrivalSection = () => {
  return (
    <section className="w-full py-2 text-white">
      <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-3">
        {/* LEFT: HERO */}
        <div className="min-h-[250px] items-center overflow-hidden rounded-xl bg-linear-to-b from-black/80 to-black/0 md:flex lg:col-span-2 lg:min-h-[450px]">
          {/* Content */}
          <div className="z-10 max-w-md p-6 lg:p-10">
            <p className="mb-2 text-xs tracking-widest text-green-400">
              LIMITED EDITION
            </p>

            <h2 className="mb-3 text-2xl font-bold lg:text-3xl">
              NEXUS PRO - PHANTOM LIME
            </h2>

            <p className="mb-6 text-sm text-gray-400">
              Experience the ultimate power delivery with our new dual-mesh coil
              technology.
            </p>

            <button className="cursor-pointer rounded-md bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200">
              ORDER NOW
            </button>
          </div>

          {/* Right Product Image Placeholder */}
          <div className="h-96 w-full lg:h-full">
            <Image
              src="/products/productImg-1.jpg"
              alt="Nexus Pro"
              width={800}
              height={600}
              className="w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* RIGHT: SIDE CARDS */}
        <div className="flex h-full flex-col gap-2">
          {/* Card 1 */}
          <div className="flex h-full items-center justify-between rounded-xl bg-linear-to-b from-black/80 to-black/0 p-5">
            <div>
              <h3 className="mb-2 font-semibold">Frozen Mango Ice</h3>
              <p className="text-base text-[#CCFF00]">$19.99</p>
              <button className="mt-5 cursor-pointer rounded-md bg-white px-2 py-1.5 text-xs font-black text-black transition hover:bg-gray-200">
                ORDER NOW
              </button>
            </div>

            <div className="h-50 w-50 rounded-lg">
              <Image
                src="/products/productImg-1.jpg"
                alt="Nexus Pro"
                width={800}
                height={600}
                className="object-contain object-right"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex h-full items-center justify-between rounded-xl bg-linear-to-b from-black/80 to-black/0 p-5">
            <div>
              <h3 className="mb-2 font-semibold">Cyber Berries</h3>
              <p className="text-base text-[#CCFF00]">$19.99</p>
              <button className="mt-5 cursor-pointer rounded-md bg-white px-2 py-1.5 text-xs font-black text-black transition hover:bg-gray-200">
                ORDER NOW
              </button>
            </div>

            <div className="h-50 w-50 rounded-lg">
              <Image
                src="/products/productImg-1.jpg"
                alt="Nexus Pro"
                width={800}
                height={600}
                className="object-contain object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
