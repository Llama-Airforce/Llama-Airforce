<script setup lang="ts">
const {
  chain = "ethereum",
  address,
  clickable = false,
} = defineProps<{
  chain?: string;
  address: string;
  clickable?: boolean;
}>();

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
    class="token"
    :src="icon"
    @error="onIconError"
  />

  <a
    v-else
    target="_blank"
    :href="link"
  >
    <img
      class="token"
      :src="icon"
      @error="onIconError"
    />
  </a>
</template>

<style scoped>
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
  object-fit: scale-down;
  border-radius: 50%;
}
</style>
