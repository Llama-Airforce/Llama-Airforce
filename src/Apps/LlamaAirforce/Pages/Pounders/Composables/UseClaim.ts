import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
import { useReadContract } from "@wagmi/vue";

import type UnionService from "@LAF/Services/UnionService";
import type { AirdropId } from "@LAF/Services/UnionService";
import { getDistributor } from "@Pounders/Models";

/** Composable to get claims, but only if they're still valid. */
export function useClaim(
  unionService: UnionService,
  airdropId: AirdropId,
  address: Ref<`0x${string}` | undefined>,
  checkValidity: boolean // Set to false to just get the claim to save RPC calls.
) {
  const { data: claimRaw } = useQuery({
    queryKey: ["union-claim", airdropId, address] as const,
    queryFn: ({ queryKey: [, airdropId, address] }) =>
      unionService.getClaim(airdropId, address!),
    enabled: computed(() => !!address.value),
  });

  const claim = computed(() => claimRaw.value?.claim);

  const distributor = getDistributor(airdropId);

  const { data: isFrozen } = useReadContract({
    abi: abiMerkle,
    address: distributor.address as `0x${string}`,
    functionName: "frozen",
    query: {
      enabled: checkValidity,
      initialData: false,
      initialDataUpdatedAt: 0,
    },
  });

  const { data: isClaimed, refetch } = useReadContract({
    abi: abiMerkle,
    address: distributor.address as `0x${string}`,
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

    return isFrozen.value ?? isClaimed.value ? undefined : claim.value;
  });

  return { claim: validClaim, refetch };
}
