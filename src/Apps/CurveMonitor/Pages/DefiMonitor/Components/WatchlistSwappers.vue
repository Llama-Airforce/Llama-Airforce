<script setup lang="ts">
import type { Address } from "@/Types/Address";
import { type Swapper, initWatchlistSwappers } from "../Models";

const emit = defineEmits<{
  swappers: [Swapper[]];
}>();

const watchlists = [initWatchlistSwappers()];
const watchlist = ref(watchlists[0]);

const swappers = computed(() => watchlist.value.items);
const selected = ref(new Set<Address>(swappers.value.map((x) => x.address)));

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
      "swappers",
      swappers.value.filter((x) => selected.has(x.address))
    );
  },
  { immediate: true, deep: true }
);

watch(watchlist, () => {
  selected.value = new Set(swappers.value.map((x) => x.address));
});
</script>

<template>
  <div class="watchlist">
    <Select
      :options="watchlists"
      :selected="watchlist"
      @select="watchlist = $event"
    >
      <template #option="{ option: { name } }">
        <div class="option">{{ name }}</div>
      </template>
    </Select>

    <Table
      :rows="swappers"
      @select="onSelect($event.address)"
    >
      <template #row="{ item: { address, name } }">
        <div>{{ name ?? "?" }}</div>

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
    --columns-data: 1fr auto;
  }
}
</style>
