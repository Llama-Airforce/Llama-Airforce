<script setup lang="ts">
import createIcon from "ethereum-blockies-base64";
import { isAddress, getAddress } from "viem";
import question from "@/Assets/Icons/question.png";

type Size = "small" | "medium" | "large" | "huge";

const { address, size = "medium" } = defineProps<{
  address: string;
  size?: Size;
}>();

const blockie = computed(() =>
  address !== EmptyAddress && isAddress(address)
    ? createIcon(getAddress(address))
    : null
);
</script>

<template>
  <img
    class="blockie"
    :class="[size, { empty: !blockie }]"
    :src="blockie ?? question"
  />
</template>

<style scoped>
.blockie {
  border-radius: 50%;
  object-fit: scale-down;

  width: var(--size, 32px);
  height: var(--size, 32px);

  &.empty {
    border-radius: 0;
  }

  &.small {
    --size: 16px;
  }

  &.medium {
    --size: 24px;
  }

  &.large {
    --size: 32px;
  }

  &.huge {
    --size: 48px;
  }
}
</style>
