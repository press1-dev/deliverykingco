import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { productKeys } from "@/lib/query-keys";
import { Product } from "@/lib/bigcommerce/api";

export function useProducts(
  params: { first?: number; entityIds?: number[] } = {},
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => clientApi.products.list(params),
    ...options,
  });
}

export function useProductBySlug(
  slug: string,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => clientApi.products.getBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}
