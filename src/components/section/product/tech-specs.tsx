
interface SpecProps {
  label: string;
  value: string;
  subValue?: string;
  progress?: number;
  progressLabel?: string;
}

function SpecCard({ label, value, subValue, progress, progressLabel }: SpecProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#111111]/30 p-5 transition-all hover:bg-[#111111]/60">
      <div className="space-y-1">
        <span className="text-[9px] font-black tracking-widest text-[#CCFF00] uppercase">
          {label}
        </span>
        <h4 className="text-lg font-bold text-white uppercase">{value}</h4>
        {subValue && (
          <p className="text-[10px] leading-relaxed text-white/30">{subValue}</p>
        )}
      </div>
      
      {progress !== undefined && (
        <div className="mt-6 space-y-2">
          <div className="h-1 w-full rounded-full bg-white/5">
            <div 
              className="h-full rounded-full bg-[#CCFF00] shadow-[0_0_8px_rgba(204,255,0,0.4)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase">
            <span className="text-white/30">{progressLabel}</span>
            <span className="text-[#CCFF00]">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function TechnicalSpecs() {
  return (
    <section className="">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-4 w-1 bg-[#CCFF00]" />
        <h2 className="text-base font-black tracking-widest text-white uppercase">
          Technical Specifications
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main Spec (Large) */}
        <div className="lg:col-span-1">
          <SpecCard
            label="Battery Performance"
            value="4000mAh Cell"
            subValue="Ultra-high density lithium-ion battery with NEX-charge technology. 0-80% charge in just 25 minutes."
            progress={82}
            progressLabel="Power Efficiency"
          />
        </div>

        {/* Other Specs Grid */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <SpecCard
            label="Tank Capacity"
            value="8.5 ML"
            subValue="Top-fill locking system."
          />
          <SpecCard
            label="Coil Type"
            value="MESH G3"
            subValue="Kanthal dual-mesh."
          />
          <SpecCard
            label="Firing Speed"
            value="0.001 S"
            subValue="Instant ignition Nexus-Chipset."
          />
          <SpecCard
            label="Max Wattage"
            value="220 W"
            subValue="Precision control mode."
          />
        </div>
      </div>
    </section>
  );
}
