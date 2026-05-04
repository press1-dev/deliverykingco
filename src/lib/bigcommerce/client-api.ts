import { Category, Product, Cart } from "./api";

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || "An error occurred while fetching data");
  }

  return json.data;
}

export const clientApi = {
  categories: {
    list: () => fetcher<Category[]>("/api/categories"),
  },
  products: {
    list: (params: { first?: number; entityIds?: number[] } = {}) => {
      const searchParams = new URLSearchParams();
      if (params.first) searchParams.set("first", params.first.toString());
      if (params.entityIds)
        searchParams.set("entityIds", params.entityIds.join(","));
      return fetcher<Product[]>(`/api/products?${searchParams.toString()}`);
    },
    getBySlug: (slug: string) => fetcher<Product>(`/api/products/${slug}`),
  },
  cart: {
    get: (cartEntityId: string) =>
      fetcher<Cart>(`/api/cart?cartEntityId=${cartEntityId}`),
    create: (
      lineItems: Array<{
        productEntityId: number;
        variantEntityId?: number;
        quantity: number;
      }>,
    ) =>
      fetcher<Cart>("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      }),
    addItems: (
      cartEntityId: string,
      lineItems: Array<{
        productEntityId: number;
        variantEntityId?: number;
        quantity: number;
      }>,
    ) =>
      fetcher<Cart>("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartEntityId, lineItems }),
      }),
  },
};
