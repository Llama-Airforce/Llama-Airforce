<script setup lang="ts">
import type { Address } from "@/types/address";

type Token = {
  address: Address;
  symbol: string;
};

const token = defineModel<Token>({
  required: true,
});

const { tokens } = defineProps<{
  tokens: Token[];
}>();

const emit = defineEmits<{
  select: [token: Token];
}>();

// Select
const onTokenSelect = (option: Token): void => {
  emit("select", option);
};

// Watches
watch(
  () => tokens,
  () => {
    if (tokens.length > 0) {
      onTokenSelect(tokens[0]);
    }
  },
  { immediate: true }
);
</script>

<template>
  <Select
    :options="tokens"
    :selected="token"
    @select="onTokenSelect"
  >
    <template #option="{ option: { address, symbol } }">
      <div class="option">
        <TokenIcon
          class="icon"
          :address
        />

        <div class="label">{{ symbol ?? "?" }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
