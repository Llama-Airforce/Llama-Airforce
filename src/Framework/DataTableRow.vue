<template>
  <div
    class="row"
    :class="{ expanded }"
  >
    <div
      class="row-data item"
      :class="{ active: selected, expandable, 'has-data': !!data }"
      @click="onClick"
    >
      <div
        v-if="data && expandable && expandSide === 'left'"
        class="expander"
        :class="{ expanded }"
      >
        <i class="fas fa-chevron-up"></i>
      </div>

      <slot name="row"></slot>

      <div
        v-if="data && expandable && expandSide !== 'left'"
        class="expander"
        :class="{ expanded }"
      >
        <i class="fas fa-chevron-up"></i>
      </div>
    </div>

    <Collapsible
      v-if="data"
      :expanded="expanded"
    >
      <div class="row-details">
        <slot name="row-details"></slot>
      </div>
    </Collapsible>
  </div>
</template>

<script setup lang="ts" generic="T">
/**
 * A single row of data in the datatable.
 * The selected and expanded states of a single row are controlled by the datatable itself.
 * For this reason the toggles are simply an event emission.
 */
// Props
interface Props<T> {
  data?: T;
  selected?: boolean;
  expanded?: boolean;
  expandSide?: "left" | "right";
}

const {
  data,
  selected = false,
  expanded = false,
  expandSide = "right",
} = defineProps<Props<T>>();

// Emits
const emit = defineEmits<{
  click: [data?: T];
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
    &.expandable.has-data:hover {
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

  .row-details {
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
  }
}
</style>
