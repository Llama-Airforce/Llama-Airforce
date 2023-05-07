<template>
  <div class="pair">
    <Select
      class="select"
      :options="coins"
      :selected="coin[0]"
      :open="selectCoinOpen[0]"
      @open="onCoinOpen(0)"
      @close="selectCoinOpen[0] = false"
      @input="onCoinSelect(0, $event, true)"
    >
      <template #item="props: { item: Coin }">
        <div class="item">
          <img
            v-if="props.item?.logo"
            :src="icon(props.item)"
          />
          <div class="label">{{ label(props.item) }}</div>
        </div>
      </template>
    </Select>

    <Select
      class="select"
      :options="coins"
      :selected="coin[1]"
      :open="selectCoinOpen[1]"
      @open="onCoinOpen(1)"
      @close="selectCoinOpen[1] = false"
      @input="onCoinSelect(1, $event, true)"
    >
      <template #item="props: { item: Coin }">
        <div class="item">
          <img
            v-if="props.item?.logo"
            :src="icon(props.item)"
          />
          <div class="label">{{ label(props.item) }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Select } from "@/Framework";
import { useCurveMonitorStore } from "@CM/Store";
import { PairService } from "@CM/Services";
import { SocketPool } from "@CM/Services/Sockets";

type Coin = {
  label: string;
  logo?: string;
};

// Refs
const store = useCurveMonitorStore();

const selectCoinOpen = ref<[boolean, boolean]>([false, false]);
const coin = ref<[Coin | null, Coin | null]>([null, null]);

const coins = computed((): Coin[] => {
  return store.coins.map((coin) => ({
    label: coin.name,
  }));
});

const pair = computed((): [Coin, Coin] | null => {
  if (store.pair) {
    return [
      {
        label: store.pair[0],
      },
      {
        label: store.pair[1],
      },
    ];
  }

  return null;
});

// Methods
const icon = (coin: Coin | null): string => {
  return coin?.logo ? `${coin.logo}` : "";
};

const label = (coin: Coin | null): string => {
  return coin ? `${coin.label}` : "?";
};

// Events
const onCoinOpen = (i: 0 | 1): void => {
  selectCoinOpen.value[i] = !selectCoinOpen.value[i];
};

const onCoinSelect = (i: 0 | 1, option: unknown, update: boolean): void => {
  const j = i === 0 ? 1 : 0;
  const oldCoin = coin.value[i];
  const newCoin = option as Coin;

  // Don't update if same coin is selected.
  if (oldCoin?.label === newCoin.label) {
    return;
  }

  coin.value[i] = newCoin;

  // Swap other coin if both coins are now equal.
  if (coin.value[i]?.label === coin.value[j]?.label) {
    coin.value[j] = oldCoin;
  }

  if (update && store.socketPool && coin.value[0] && coin.value[1]) {
    const pairService = new PairService(store.socketPool as SocketPool);
    pairService.update(store.timeRange, [
      coin.value[0].label,
      coin.value[1].label,
    ]);
  }
};

// Watches
watch(pair, () => {
  onCoinSelect(0, pair.value ? pair.value[0] : null, false);
  onCoinSelect(1, pair.value ? pair.value[1] : null, false);
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.pair {
  display: flex;
  gap: 1rem;

  ::v-deep(.select) {
    padding: 0.1rem 0.33rem;

    .chevrons {
      font-size: 0.5rem;
    }

    .items {
      margin-top: 2.25rem;
    }

    .item {
      display: flex;
      align-items: center;
      width: 6rem;

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
}
</style>
