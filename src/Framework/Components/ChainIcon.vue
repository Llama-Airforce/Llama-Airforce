<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";

type Chains = Chain | "gnosis";

const { chain = "ethereum" } = defineProps<{
  chain?: Chains;
}>();

const icon = ref("");

function getIcon(chain: Chains) {
  if (chain === "gnosis") chain = "xdai";

  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/chains/${chain}.png`;
}

const onIconError = () => {
  icon.value = "https://lend.curve.fi/images/default-crypto.png";
};

watch(
  () => chain,
  (chain) => {
    icon.value = getIcon(chain);
  },
  { immediate: true }
);
</script>

<template>
  <img
    class="chain"
    :src="icon"
    @error="onIconError"
  />
</template>

<style scoped>
img {
  aspect-ratio: 1;
  max-width: 100%;
  object-fit: scale-down;
  border-radius: 50%;
}
</style>
