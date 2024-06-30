<template>
  <Select
    class="select"
    :options="tokens"
    :selected="token"
    :open="selectTokenOpen"
    @open="onTokenOpen"
    @close="selectTokenOpen = false"
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

<script setup lang="ts">
type Token = {
  address: Address;
  symbol: string;
};

// Props
interface Props {
  tokens: Token[];
}

const { tokens } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  select: [token: Token];
}>();

// Refs
const token = defineModel<Token>({
  required: true,
});
const selectTokenOpen = ref(false);

// Events
const onTokenOpen = (): void => {
  selectTokenOpen.value = !selectTokenOpen.value;
};

const onTokenSelect = (option: Token): void => {
  emit("select", option);
};

// Watches
watch(
  () => tokens,
  () => {
    if (tokens && tokens.length > 0) {
      onTokenSelect(tokens[0]);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

::v-deep(.select) {
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
}
</style>
