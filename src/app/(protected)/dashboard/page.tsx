export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-[#CCFF00]">
        Account Dashboard
      </h1>
      <p className="mt-4 text-[#C4C9AC]">
        Manage your orders, subscriptions, and profile settings.
      </p>
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="h-4 w-24 rounded bg-[#CCFF00]/20" />
            <div className="mt-4 h-8 w-full rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
