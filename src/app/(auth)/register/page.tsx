export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-8 p-8 border border-white/10 rounded-xl">
        <h2 className="text-center text-3xl font-black uppercase tracking-tighter text-[#CCFF00]">
          Create Account
        </h2>
        <p className="text-center text-sm text-[#C4C9AC]">
          Join the premium vaping community.
        </p>
        {/* Placeholder for Auth Form */}
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-lg">
          <p className="text-white/20 italic">Registration Form Placeholder</p>
        </div>
      </div>
    </div>
  );
}
