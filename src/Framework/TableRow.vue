<script setup lang="ts" generic="T">
/**
 * A single row of data in the table.
 * The selected and expanded states of a single row are controlled by the table itself.
 * For this reason the toggles are simply an event emission.
 */

const {
  data,
  selected = false,
  expanded = false,
  expandSide = "right",
} = defineProps<{
  data?: T;
  selected?: boolean;
  expanded?: boolean;
  expandSide?: "left" | "right";
}>();

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
      return Array.isArray(children) && children.length > 0;
    }
  }

  return false;
});

// Events
const onClick = (): void => {
  emit("click", data);
};
</script>

<template>
  <div
    class="row"
    :class="{ expanded }"
  >
    <div
      class="row-data"
      :class="{ active: selected, expandable, 'has-data': !!data }"
      @click="onClick"
    >
      <div
        v-if="data && expandable && expandSide === 'left'"
        class="expander"
      >
        <i class="fas fa-chevron-up"></i>
      </div>

      <slot name="row"></slot>

      <div
        v-if="data && expandable && expandSide !== 'left'"
        class="expander"
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

<style lang="scss" scoped>
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

  &.expanded {
    > .row-data {
      background: var(--c-lvl1);
      border-bottom-width: 0;

      > .expander {
        > i {
          transform: rotate(180deg);
        }
      }
    }
  }

  /** Utility classes for row cells. */
  :deep(.row-data) {
    .center {
      justify-self: center;
    }

    .end {
      justify-self: end;
    }
  }

  > .row-data {
    display: grid;
    grid-template-columns: var(--columns-data);
    padding: 0 1rem;
    grid-column-gap: 1rem;
    min-height: 3rem;
    //border-bottom: var(--border-thickness) solid var(--c-lvl4);
    align-items: center;
    transition: background var(--hover-duration);

    // These direct divs are most likely your individual cells.
    :deep(> div) {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &:last-child {
      border-bottom-width: 0;
    }

    &.selected-below {
      border-bottom: var(--border-thickness) solid var(--c-primary);
    }

    &.expandable.has-data:hover {
      cursor: pointer;
    }

    &.has-data {
      &:hover {
        background: var(--container-background-hover);
      }

      &:active,
      &.active {
        background: var(--container-background-active);
      }
    }

    > .expander {
      color: var(--c-primary);
      text-align: center;
      animation: pulse 1000ms 2;

      transition: scale var(--hover-duration) ease-in-out; // For hover scaling.

      > i {
        transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
        transform: rotate(90deg);
      }
    }
  }

  .row-details {
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
  }
}
</style>
