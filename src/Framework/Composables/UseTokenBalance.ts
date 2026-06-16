import { erc20Abi as abi } from "viem";
import type { Address } from "@/types/address";

type TokenBalanceParameters = {
  address: MaybeRef<Address | undefined>;
  token: MaybeRef<Address | undefined>;
};

type TokenBalanceData = {
  decimals: 18;
  symbol: "";
  value: bigint;
};

export function useTokenBalance({ address, token }: TokenBalanceParameters) {
  const owner = computed(() => unref(address));
  const tokenAddress = computed(() => unref(token));

  const result = useReadContract({
    abi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: computed(() => [owner.value!] as const),
    query: {
      enabled: computed(() => !!owner.value && !!tokenAddress.value)
    }
  });

  const data = computed<TokenBalanceData | undefined>(() => {
    if (result.data.value === undefined) {
      return undefined;
    }

    return {
      decimals: 18,
      symbol: "",
      value: result.data.value
    };
  });

  return {
    ...result,
    data
  };
}
