import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { clientApi } from "@/lib/bigcommerce/client-api";
import { cartKeys } from "@/lib/query-keys";
import { Cart } from "@/lib/bigcommerce/api";

export function useCart(
  cartEntityId: string,
  options?: Omit<UseQueryOptions<Cart, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: cartKeys.detail(cartEntityId),
    queryFn: () => clientApi.cart.get(cartEntityId),
    enabled: !!cartEntityId,
    ...options,
  });
}

export function useCreateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientApi.cart.create,
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(data.entityId), data);
    },
  });
}

export function useAddCartItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartEntityId,
      lineItems,
    }: {
      cartEntityId: string;
      lineItems: Array<{
        productEntityId: number;
        variantEntityId?: number;
        quantity: number;
      }>;
    }) => clientApi.cart.addItems(cartEntityId, lineItems),
    onSuccess: (data) => {
      queryClient.setQueryData(cartKeys.detail(data.entityId), data);
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(data.entityId) });
    },
  });
}
