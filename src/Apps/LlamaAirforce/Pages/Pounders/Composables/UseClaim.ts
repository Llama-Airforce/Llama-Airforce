import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
import type { Address } from "@/types/address";
import type UnionService from "@LAF/Services/UnionService";
import type { AirdropId } from "@LAF/Services/UnionService";
import { getDistributor } from "@Pounders/Models";

/** Composable to get claims, but only if they're still valid. */
export function useClaim(
  unionService: UnionService,
  airdropId: AirdropId,
  address: Ref<Address | undefined>,
  checkValidity: boolean // Set to false to just get the claim to save RPC calls.
) {
  const { data: claim } = useQuery({
    queryKey: ["union-claim", airdropId, address] as const,
    queryFn: ({ queryKey: [, airdropId, address] }) =>
      unionService.getClaim(airdropId, address!),
    enabled: computed(() => !!address.value),
  });

  const distributor = getDistributor(airdropId);

  const { data: isFrozen } = useReadContract({
    abi: abiMerkle,
    address: distributor.address,
    functionName: "frozen",
    query: {
      enabled: checkValidity,
      initialData: false,
      initialDataUpdatedAt: 0,
    },
  });

  const { data: isClaimed, refetch } = useReadContract({
    abi: abiMerkle,
    address: distributor.address,
    functionName: "isClaimed",
    args: computed(() => [BigInt(claim.value?.index ?? 0)] as const),
    query: {
      enabled: computed(() => checkValidity && !!claim.value),
      initialData: false,
      initialDataUpdatedAt: 0,
    },
  });

  const validClaim = computed(() => {
    if (!checkValidity) {
      return claim.value;
    }

    // The null coasc operator is fake news, it breaks the code.
    return isFrozen.value || isClaimed.value ? undefined : claim.value;
  });

  return { claim: validClaim, refetch };
}
