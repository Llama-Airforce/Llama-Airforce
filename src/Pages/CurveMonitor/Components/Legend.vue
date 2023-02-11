<template>
  <div class="legend">
    <div
      v-for="(coin, i) in coins"
      :key="coin.name"
      class="coin"
    >
      <div
        class="color"
        :style="{ 'background-color': colors[i] }"
      ></div>

      <div class="label">{{ coin.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { Coin } from "@/Pages/CurveMonitor/Models";

// Refs
const store = useCurveMonitorStore();

const coins = $computed((): Coin[] => {
  return store.coins;
});

const colors = [
  "rgb(32, 129, 240)",
  "rgb(255, 204, 0)",
  "rgb(126, 217, 87)",
  "rgb(255, 87, 87)",
];
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.legend {
  display: flex;
  gap: 1.5rem;

  > .coin {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    > .color {
      width: 0.75rem;
      height: 0.75rem;
    }

    > .label {
      font-size: 0.875rem;
      color: $level5-color;
    }
  }
}
</style>
