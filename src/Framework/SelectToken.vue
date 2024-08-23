<script setup lang="ts">
import { type Address } from "@/Framework/Address";

type Token = {
  address: Address;
  symbol: string;
};

// Props
interface Props {
  tokens: Token[];
}

const { tokens } = defineProps<Props>();

const token = defineModel<Token>({
  required: true,
});

// Emits
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
    <template #item="{ item: { address, symbol } }: { item: Token }">
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
