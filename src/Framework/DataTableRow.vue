<template>
  <div
    class="row"
    :class="{ expanded }"
  >
    <div
      class="row-data item"
      :class="[columns, { active: selected, expandable }]"
      @click="onClick"
    >
      <slot name="row"></slot>
      <div
        v-if="expandable"
        class="expander"
        :class="{ expanded }"
      >
        <i class="fas fa-chevron-up"></i>
      </div>
    </div>

    <Collapsible :expanded="expanded">
      <div class="row-details">
        <slot name="row-details"></slot>
      </div>
    </Collapsible>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import { Collapsible } from "@/Framework";

/**
 * A single row of data in the datatable.
 * The selected and expanded states of a single row are controlled by the datatable itself.
 * For this reason the toggles are simply an event emission.
 */
// Props
interface Props {
  data?: unknown;
  columns?: string;
  selected?: boolean;
  expanded?: boolean;
}

const {
  data,
  columns = "auto",
  selected = false,
  expanded = false,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  click: [data: unknown];
}>();

// Refs
const slots = useSlots();
const expandable = computed((): boolean => {
  const slot = slots["row-details"];

  if (slot) {
    const children = slot()[0]?.children;
    if (children) {
      return (children as []).length > 0;
    }
  }

  return false;
});

// Events
const onClick = (): void => {
  emit("click", data);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

.row {
  display: flex;
  flex-direction: column;

  &:hover {
    > .row-data {
      > .expander {
        color: var(--c-primary-hover);
        scale: 1.25;
      }
    }
  }

  > .row-data {
    &.expandable:hover {
      cursor: pointer;
    }

    > .expander {
      color: var(--c-primary);
      text-align: center;
      animation: pulse 1000ms 2;

      transition: scale $hover-duration ease-in-out; // For hover scaling.

      > i {
        transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
        transform: rotate(90deg);
      }

      &.expanded {
        > i {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
