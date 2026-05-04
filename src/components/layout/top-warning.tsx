export function TopWarning() {
  return (
    <div className="w-full min-h-[32px] py-1.5 bg-white text-center flex items-center justify-center px-4">
      <p className="font-heading font-semibold text-[10px] md:text-sm uppercase text-background tracking-[0.33px] leading-tight">
        {" "}
        <span className="font-semibold">WARNING:</span> this product contains
        nicotine. Nicotine is an addictive chemical.
      </p>
    </div>
  );
}
