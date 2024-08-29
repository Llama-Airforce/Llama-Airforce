<script setup lang="ts">
import type { Address } from "@/Framework/Address";
import { type Token, initWatchlistTokens } from "../Models";

const emit = defineEmits<{
  tokens: [Token[]];
}>();

const watchlists = [initWatchlistTokens()];
const watchlist = ref(watchlists[0]);

const tokens = computed(() => watchlist.value.items);
const selected = ref(new Set<Address>(tokens.value.map((x) => x.address)));

const onSelect = (address: Address) => {
  if (selected.value.has(address)) {
    selected.value.delete(address);
  } else {
    selected.value.add(address);
  }
};

watch(
  selected,
  (selected) => {
    emit(
      "tokens",
      tokens.value.filter((x) => selected.has(x.address))
    );
  },
  { immediate: true, deep: true }
);

watch(watchlist, () => {
  selected.value = new Set(tokens.value.map((x) => x.address));
});
</script>

<template>
  <div class="watchlist">
    <Select
      :options="watchlists"
      :selected="watchlist"
      @input="watchlist = $event"
    >
      <template #item="{ item: { name } }">
        <div class="item">{{ name }}</div>
      </template>
    </Select>

    <Table
      :rows="tokens"
      @selected="onSelect($event.address)"
    >
      <template #row="{ item: { address, symbol } }">
        <TokenIcon :address="address"></TokenIcon>
        <div>{{ symbol ?? "?" }}</div>

        <div
          class="center"
          @click.stop
        >
          <Checkbox
            :model-value="selected.has(address)"
            @update:model-value="onSelect(address)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.watchlist {
  display: flex;
  flex-direction: column;
  gap: 1ch;

  .table {
    --columns-data: 26px 1fr auto;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }
  }
}
</style>
