<script setup lang="ts">
import { type Address } from "@/Framework/Address";

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
    @input="onTokenSelect"
  >
    <template #item="{ item: { address, symbol } }">
      <div class="item">
        <TokenIcon
          class="icon"
          :address="address"
        ></TokenIcon>

        <div class="label">{{ symbol ?? "?" }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.item {
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
