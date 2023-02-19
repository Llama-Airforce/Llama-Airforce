<template>
  <div class="pair">
    <Select
      class="select"
      :options="coins"
      :selected="coin[0]"
      :open="selectCoinOpen[0]"
      @open="onCoinOpen(0)"
      @close="selectCoinOpen[0] = false"
      @input="onCoinSelect(0, $event)"
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
      @input="onCoinSelect(1, $event)"
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
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { Select } from "@/Framework";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { PairService } from "@/Pages/CurveMonitor/Services";
import { SocketPool } from "@/Pages/CurveMonitor/Services/Sockets";

type Coin = {
  label: string;
  logo?: string;
};

// Refs
const store = useCurveMonitorStore();

const coins = $computed((): Coin[] => {
  return store.coins.map((coin) => ({
    label: coin.name,
  }));
});

const pair = $computed((): [Coin, Coin] | null => {
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

const selectCoinOpen = $ref([false, false]);
const coin: [Coin | null, Coin | null] = $ref([null, null]);

// Methods
const icon = (coin: Coin | null): string => {
  return coin?.logo ? `${coin.logo}` : "";
};

const label = (coin: Coin | null): string => {
  return coin ? `${coin.label}` : "?";
};

// Events
const onCoinOpen = (i: 0 | 1): void => {
  selectCoinOpen[i] = !selectCoinOpen[i];
};

const onCoinSelect = (i: 0 | 1, option: unknown): void => {
  const oldCoin = coin[i];
  const newCoin = option as Coin;
  const j = i === 0 ? 1 : 0;

  // Don't update if same coin is selected.
  if (oldCoin?.label === newCoin.label) {
    return;
  }

  coin[i] = newCoin;

  // Swap other coin if both coins are now equal.
  if (coin[i]?.label === coin[j]?.label) {
    coin[j] = oldCoin;
  }

  if (store.socketPool && coin[0] && coin[1]) {
    const pairService = new PairService(store.socketPool as SocketPool);
    pairService.update(store.timeRange, [coin[0].label, coin[1].label]);
  }
};

// Watches
watch(
  () => pair,
  () => {
    onCoinSelect(0, pair ? pair[0] : null);
    onCoinSelect(1, pair ? pair[1] : null);
  }
);
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
      margin-top: 1.75rem;
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
