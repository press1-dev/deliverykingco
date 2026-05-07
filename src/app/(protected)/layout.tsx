import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  // This is where you would add your session check / auth guard
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}
