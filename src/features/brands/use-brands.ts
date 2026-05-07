import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { brandKeys } from "@/lib/query-keys";
import { Brand } from "@/lib/bigcommerce/api";

export function useBrands(
  options?: Omit<UseQueryOptions<Brand[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: clientApi.brands.list,
    ...options,
  });
}
