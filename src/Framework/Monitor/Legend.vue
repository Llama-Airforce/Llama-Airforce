<template>
  <div class="legend">
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ clickable, disabled: disabled.includes(item.id) }"
      @click="
        if (clickable) {
          emit('click', item.id);
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

<script setup lang="ts" generic="T extends string">
export type LegendItem<T> = {
  id: T;
  label: string;
  color: string;
};

// Props
interface Props<T> {
  items: LegendItem<T>[];
  clickable?: boolean;
  disabled?: T[];
}

const { items, clickable = false, disabled = [] } = defineProps<Props<T>>();

// Emits
const emit = defineEmits<{
  click: [item: T];
}>();
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
