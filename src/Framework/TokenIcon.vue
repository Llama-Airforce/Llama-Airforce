<script setup lang="ts">
// Props
interface Props {
  chain?: string;
  address: string;
  clickable?: boolean;
}

const { chain = "ethereum", address, clickable = false } = defineProps<Props>();

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
  (address) => {
    icon.value = getIcon(address.toLowerCase());
  },
  { immediate: true }
);

// Link
const link = computed(() => {
  switch (chain) {
    case "arbitrum":
      return `https://arbiscan.io/address/${address}`;
    case "ethereum":
    default:
      return `https://etherscan.io/address/${address}`;
  }
});
</script>

<template>
  <img
    v-if="!clickable"
    :src="icon"
    @error="onIconError"
  />

  <a
    v-else
    target="_blank"
    :href="link"
  >
    <img
      :src="icon"
      @error="onIconError"
    />
  </a>
</template>

<style lang="scss" scoped>
a {
  all: initial;

  img {
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--c-text);
    cursor: pointer;
  }
}

img {
  aspect-ratio: 1;
  max-width: 100%;
  object-fit: contain;
  border-radius: 50%;
}
</style>
