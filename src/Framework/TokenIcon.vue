<template>
  <img
    :src="icon"
    @error="onIconError"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

// Props
interface Props {
  chain?: string;
  address: string;
}

const { chain = "ethereum", address } = defineProps<Props>();

// Icon
const icon = ref("");

function getIcon(tokenAddress: string) {
  const chainSuffix = chain !== "ethereum" ? `-${chain}` : "";

  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets${chainSuffix}/${tokenAddress}.png`;
}

const onIconError = () => {
  icon.value = "https://lend.curve.fi/images/default-crypto.png";
};

watch(
  () => address,
  (newAddress) => {
    icon.value = getIcon(newAddress.toLowerCase());
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
img {
  aspect-ratio: 1;
  max-width: 100%;
  object-fit: contain;
  border-radius: 50%;
}
</style>
