<script setup lang="ts">
import { mainnet } from "viem/chains";
import { abi as lockerAbi } from "@/ABI/TheLlamas/LlamaLocker";
import { abi } from "@/ABI/Tokens/TheLlamas";

const { address, chainId } = useAccount();

const uri = ref("");

const { data: tokens } = useReadContract({
  abi,
  address: TheLlamas,
  functionName: "tokensForOwner",
  args: computed(() => [address.value!] as const),
  query: {
    enabled: computed(() => !!address.value && chainId.value === mainnet.id),
  },
});

const { data: locks } = useReadContract({
  abi: lockerAbi,
  address: TheLlamasLocker,
  functionName: "getLocksByOwner",
  args: computed(() => [address.value!] as const),
  query: {
    enabled: computed(() => !!address.value && chainId.value === mainnet.id),
  },
});

const llamaId = computed(() => tokens.value?.[0] ?? locks.value?.[0]?.tokenId ?? 0n);
  
const { data: tokenUri } = useReadContract({
  abi,
  address: TheLlamas,
  functionName: "tokenURI",
  args: computed(() => [llamaId.value] as const),
  query: {
    enabled: computed(() => llamaId.value > 0n)
  },
});

watch(tokenUri, async (tokenUri) => {
  if (!tokenUri) {
    uri.value = "";
    return;
  }

  const tokenResp = await fetch(tokenUri);
  const token = (await tokenResp.json()) as { image: string } | undefined;
  if (token?.image) {
    uri.value = token.image;
  }
});
</script>

<template>
  <img
    v-if="uri"
    :src="uri"
  />
</template>

<style scoped>
img {
  width: 100%;
  max-width: 100%;
  object-fit: scale-down;
}
</style>
