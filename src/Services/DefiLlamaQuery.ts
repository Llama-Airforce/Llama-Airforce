import { useQuery } from "@tanstack/vue-query";
import { type Address } from "@/Framework/Address";
import DefiLlamaService, { type Price } from "@/Services/DefiLlamaService";

const service = new DefiLlamaService();

export function useQueryPrice(address: Ref<Address | undefined>) {
  return useQuery({
    queryKey: ["token-price", address] as const,
    queryFn: async ({ queryKey: [, address] }) => service.getPrice(address!),
    enabled: computed(() => !!address.value),
  });
}

export function useQueryPrices(addresses: Ref<Address[]>) {
  const priceQueries = useQueries({
    queries: computed(() =>
      addresses.value.map((address) => ({
        queryKey: ["token-price", address] as const,
        queryFn: () => service.getPrice(address),
      }))
    ),
  });

  const data = computed(() => {
    if (priceQueries.value.some((query) => query.isLoading)) {
      return undefined;
    }

    const prices = Object.fromEntries(
      addresses.value.map((address, index) => [
        address,
        priceQueries.value[index].data,
      ])
    );

    return prices as Record<Address, Price | undefined>;
  });

  const isLoading = computed(() =>
    priceQueries.value.some((query) => query.isLoading)
  );

  return {
    data,
    isLoading,
  };
}
