"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "@/providers/auth-provider";

export interface CartLineItem {
  id: string;
  productId: number;
  variantId: number;
  name: string;
  quantity: number;
  listPrice: number;
  salePrice: number;
  extendedListPrice: number;
  extendedSalePrice: number;
  imageUrl: string;
  options: Array<{ name: string; value: string }>;
  sku?: string;
}

export interface CartData {
  id: string;
  customerId: number;
  baseAmount: number;
  discountAmount: number;
  cartAmount: number;
  currency: string;
  items: CartLineItem[];
  itemCount: number;
}

interface CartContextType {
  cart: CartData | null;
  isLoading: boolean;
  error: string;
  addItem: (productId: number, variantId?: number, quantity?: number) => Promise<void>;
  updateItemQty: (itemId: string, productId: number, variantId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CART_STORAGE_KEY = "dk_cart_id";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const prevUserRef = useRef<typeof user>(undefined);

  const getCartId = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CART_STORAGE_KEY);
  };

  const setCartId = (id: string | null) => {
    if (typeof window === "undefined") return;
    if (id) {
      localStorage.setItem(CART_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const fetchCart = useCallback(async (localCartId: string | null) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/cart/manage${localCartId ? `?cartId=${localCartId}` : ""}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.cart) {
          setCart(data.cart);
          // Server is authoritative — always sync localStorage to its response
          setCartId(data.cart.id);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("fetchCart error:", err);
    }

    // No valid cart — clean up
    setCartId(null);
    setCart(null);
    setIsLoading(false);
  }, []);

  const refreshCart = useCallback(async () => {
    await fetchCart(getCartId());
  }, [fetchCart]);

  // Core sync effect: handles initial load, login, and logout transitions
  useEffect(() => {
    // Wait for auth to finish loading before syncing
    if (authLoading) return;

    const prevUser = prevUserRef.current;
    prevUserRef.current = user;

    // Skip on first render when prevUser is still undefined
    if (prevUser === undefined) {
      // Initial load — just fetch with whatever cartId is in localStorage
      fetchCart(getCartId());
      return;
    }

    if (!prevUser && user) {
      // LOGIN: User just logged in
      // Pass the guest cartId so the server can merge it with the customer's saved cart
      const guestCartId = getCartId();
      fetchCart(guestCartId);
    } else if (prevUser && !user) {
      // LOGOUT: Clear everything immediately
      setCartId(null);
      setCart(null);
      setIsLoading(false);
    }
    // If user reference changed but both are truthy (e.g. refresh), re-fetch
    else if (user && prevUser && user.id !== prevUser.id) {
      setCartId(null);
      fetchCart(null);
    }
  }, [user, authLoading, fetchCart]);

  // Sync cart across browser tabs when localStorage changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        fetchCart(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCart]);

  const addItem = async (productId: number, variantId?: number, quantity?: number) => {
    setError("");
    try {
      const cartId = getCartId();

      const res = await fetch("/api/cart/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: cartId ? "add" : "create",
          cartId,
          productId,
          variantId,
          quantity: quantity || 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // If the existing cart is gone (404/expired), retry by creating a new one
        if (res.status === 500 && cartId) {
          setCartId(null);
          const retryRes = await fetch("/api/cart/manage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "create",
              productId,
              variantId,
              quantity: quantity || 1,
            }),
          });
          const retryData = await retryRes.json();
          if (!retryRes.ok) {
            setError(retryData.error || "Failed to add item");
            return;
          }
          if (retryData.cartId) {
            setCartId(retryData.cartId);
          }
          await refreshCart();
          return;
        }
        setError(data.error || "Failed to add item");
        return;
      }

      if (data.cartId) {
        setCartId(data.cartId);
      }

      await refreshCart();
    } catch {
      setError("Failed to add item to cart");
    }
  };

  const updateItemQty = async (
    itemId: string,
    productId: number,
    variantId: number,
    quantity: number
  ) => {
    setError("");
    const cartId = getCartId();
    if (!cartId) return;

    try {
      const res = await fetch("/api/cart/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, itemId, productId, variantId, quantity }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update quantity");
        return;
      }

      await refreshCart();
    } catch {
      setError("Failed to update item");
    }
  };

  const removeItem = async (itemId: string) => {
    setError("");
    const cartId = getCartId();
    if (!cartId) return;

    try {
      const res = await fetch(
        `/api/cart/manage?cartId=${cartId}&itemId=${itemId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        setError("Failed to remove item");
        return;
      }

      await refreshCart();
    } catch {
      setError("Failed to remove item");
    }
  };

  const clearCart = async () => {
    setError("");
    const cartId = getCartId();
    if (!cartId) return;

    try {
      const res = await fetch(`/api/cart/manage?cartId=${cartId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.cleared) {
        setCartId(null);
        setCart(null);
      }
    } catch {
      setError("Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, isLoading, error, addItem, updateItemQty, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}

