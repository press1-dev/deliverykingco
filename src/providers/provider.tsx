import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { CartProvider } from "./cart-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
