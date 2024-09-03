<script setup lang="ts" generic="T extends string">
import { type LegendItem } from "@/Framework/Monitor/LegendItem";

const { items, disabled = [] } = defineProps<{
  items: LegendItem<T>[];
  disabled?: T[];
}>();

const emit = defineEmits<{
  toggle: [item: T];
}>();
</script>

<template>
  <div class="legend">
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{
        togglable: item.togglable,
        disabled: disabled.includes(item.id),
      }"
      @click="
        if (item.togglable) {
          emit('toggle', item.id);
        }
      "
    >
      <div
        class="color"
        :style="{ 'background-color': item.color }"
      ></div>

      <div class="label">{{ item.label }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.legend {
  display: flex;
  gap: 1.5rem;

  > .item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.togglable {
      cursor: pointer;
      user-select: none;

      // Make label act like a link with hover style
      &:hover > .label {
        color: var(--c-lvl0);
        background: var(--c-lvl6);
      }
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
