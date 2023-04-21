<template>
  <img
    v-if="uri"
    :src="uri"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useWalletStore, getProvider } from "@/Wallet";
import { TheLlamas__factory } from "@/Contracts";
import { TheLlamas } from "@/Util/Addresses";

// Refs
const wallet = useWalletStore();

const uri = ref("");

// Hooks
onMounted(async (): Promise<void> => {
  await getNFT();
});

// Methods
const getNFT = async () => {
  const provider = getProvider();

  if (!provider || !wallet.address) {
    return;
  }

  const llamas = TheLlamas__factory.connect(TheLlamas, provider);
  const tokens = await llamas.tokensForOwner(wallet.address);
  if (tokens.length === 0) {
    return;
  }

  const tokenUri = await llamas.tokenURI(tokens[0]);
  const tokenResp = await fetch(tokenUri);
  const token = (await tokenResp.json()) as { image: string };
  if (token && token.image) {
    uri.value = token.image;
  }
};

// Watches
watch(() => wallet.address, getNFT);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

img {
  width: 100%;
  max-width: 100%;
  object-fit: scale-down;
}
</style>
