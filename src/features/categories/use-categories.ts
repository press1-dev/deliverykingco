import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { categoryKeys } from "@/lib/query-keys";
import { Category } from "@/lib/bigcommerce/api";

export function useCategories(
  options?: Omit<UseQueryOptions<Category[], Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: clientApi.categories.list,
    ...options,
  });
}
