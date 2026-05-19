"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

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
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Fetch cart data from API
  const fetchCart = useCallback(async (cartId: string): Promise<CartData | null> => {
    try {
      const res = await fetch(`/api/cart/manage?cartId=${cartId}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.cart || null;
    } catch {
      return null;
    }
  }, []);

  const refreshCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    const cartData = await fetchCart(cartId);
    if (cartData) {
      setCart(cartData);
    } else {
      // Cart expired or deleted
      setCartId(null);
      setCart(null);
    }
    setIsLoading(false);
  }, [fetchCart]);

  // Load cart on mount
  useEffect(() => {
    let cancelled = false;
    const cartId = typeof window !== "undefined"
      ? localStorage.getItem(CART_STORAGE_KEY)
      : null;

    if (!cartId) {
      // Use a microtask to set state without synchronous setState in effect body
      Promise.resolve().then(() => {
        if (!cancelled) setIsLoading(false);
      });
      return () => { cancelled = true; };
    }

    fetch(`/api/cart/manage?cartId=${cartId}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.cart) {
          setCart(data.cart);
        } else {
          setCartId(null);
          setCart(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setCartId(null);
          setCart(null);
          setIsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

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
        setError(data.error || "Failed to add item");
        return;
      }

      // If we created a new cart, save its ID
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
