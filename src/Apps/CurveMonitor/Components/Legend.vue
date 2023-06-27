<template>
  <div class="legend">
    <div
      v-for="(item, i) in items"
      :key="item"
      class="item"
      :class="{ clickable, disabled: disabled.includes(item) }"
      @click="
        if (clickable) {
          emit('click', item);
        }
      "
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
import { useSettingsStore } from "@CM/Stores/SettingsStore";

// Props
interface Props {
  items: string[];
  clickable?: boolean;
  disabled?: string[];
}

const { items, clickable = false, disabled = [] } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [item: string];
}>();

// Refs
const storeSettings = useSettingsStore();

// Methods
const color = (i: number): string => {
  return getColorsArray(storeSettings.theme)[i];
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

    &.clickable {
      cursor: pointer;
      user-select: none;
    }

    &.disabled {
      > .color {
        opacity: 0.25;
      }
    }

    > .color {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: var(--border-radius) !important;
      transition: opacity 125ms ease-out;
    }

    > .label {
      font-size: 0.875rem;
      color: var(--c-lvl5);
    }
  }
}
</style>
