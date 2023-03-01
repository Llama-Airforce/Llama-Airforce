<template>
  <div class="legend">
    <div
      v-for="(coin, i) in coins"
      :key="coin.name"
      class="coin"
    >
      <div
        class="color"
        :style="{ 'background-color': ColorsArray[i] }"
      ></div>

      <div class="label">{{ coin.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import { Coin } from "@/Pages/CurveMonitor/Models";
import { ColorsArray } from "@/Util";

// Refs
const store = useCurveMonitorStore();

const coins = computed((): Coin[] => {
  return store.coins;
});
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
