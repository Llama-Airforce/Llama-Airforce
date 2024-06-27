<template>
  <img
    v-if="uri"
    :src="uri"
  />
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";
import { abi } from "@/ABI/Tokens/TheLlamas";

// Refs
const { address, network } = useWallet();

const uri = ref("");

const { data: tokens } = useReadContract({
  abi,
  address: TheLlamas,
  functionName: "tokensForOwner",
  args: computed(() => [address.value!] as const),
  query: {
    enabled: computed(() => !!address.value && network.value === "ethereum"),
  },
});

const { data: tokenUri } = useReadContract({
  abi,
  address: TheLlamas,
  functionName: "tokenURI",
  args: computed(() => [tokens.value?.[0] ?? 0n] as const),
  query: {
    enabled: computed(() => (tokens.value?.length ?? 0) > 0),
  },
});

watch(tokenUri, async (newTokenUri) => {
  if (!newTokenUri) {
    uri.value = "";
    return;
  }

  const tokenResp = await fetch(newTokenUri);
  const token = (await tokenResp.json()) as { image: string };
  if (token?.image) {
    uri.value = token.image;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

img {
  width: 100%;
  max-width: 100%;
  object-fit: scale-down;
}
</style>
