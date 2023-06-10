<template>
  <div class="legend">
    <div
      v-for="(item, i) in items"
      :key="item"
      class="item"
    >
      <div
        class="color"
        :style="{ 'background-color': color(i) }"
      ></div>

      <div class="label">{{ item }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getColorsArray } from "@/Styles/Themes/CM";
import { useCurveMonitorStore } from "@CM/Store";

// Props
interface Props {
  items: string[];
}

const { items } = defineProps<Props>();

// Refs
const store = useCurveMonitorStore();

// Methods
const color = (i: number): string => {
  return getColorsArray(store.theme)[i];
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.legend {
  display: flex;
  gap: 1.5rem;

  > .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    > .color {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: var(--border-radius) !important;
    }

    > .label {
      font-size: 0.875rem;
      color: var(--c-lvl5);
    }
  }
}
</style>
