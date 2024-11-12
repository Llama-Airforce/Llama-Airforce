<script setup lang="ts" generic="T">
/**
 * A single row of data in the table.
 * The selected and expanded states of a single row are controlled by the table itself.
 * For this reason the toggles are simply an event emission.
 */

const {
  data,
  selected = false,
  selectable = false,
  hoverable = true,
  expanded = false,
  expandSide = "right",
} = defineProps<{
  data?: T;
  selected?: boolean;
  selectable?: boolean;
  hoverable?: boolean;
  expanded?: boolean;
  expandSide?: "left" | "right";
}>();

const emit = defineEmits<{
  select: [data: T];
}>();
</script>

<template>
  <div
    class="row"
    :class="{ expanded }"
  >
    <div
      class="row-data"
      :class="{ active: selected, selectable, hoverable }"
      @click="selectable && data && emit('select', data)"
    >
      <LucideChevronUp
        v-if="data && selectable && expandSide === 'left'"
        class="expander"
      />

      <slot></slot>

      <LucideChevronUp
        v-if="data && selectable && expandSide !== 'left'"
        class="expander"
      />
    </div>

    <Collapsible
      v-if="data"
      :expanded
    >
      <div class="row-details">
        <slot name="row-details"></slot>
      </div>
    </Collapsible>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: column;

  &:hover {
    > .row-data {
      > .expander {
        color: hsl(
          from var(--c-primary) h s calc(l + 6 * var(--color-scheme-dark))
        );
        scale: 1.25;
      }
    }
  }

  &.expanded {
    > .row-data {
      background-color: var(--row-background, --c-lvl1);
      border-bottom-width: 0;

      > .expander {
        rotate: 180deg;
      }
    }
  }

  > .row-data {
    display: grid;
    grid-template-columns: var(--columns-data);
    padding: 0 1rem;
    grid-column-gap: var(--columns-gap, 1rem);
    min-height: 3rem;
    align-items: center;
    background-color: var(--row-background, --c-lvl1);
    transition: background-color var(--hover-duration);

    &:last-child {
      border-bottom-width: 0;
    }

    &.selected-below {
      border-bottom: var(--border-thickness) solid var(--c-primary);
    }

    &.hoverable,
    &.selectable {
      &:hover {
        background-color: hsl(
          from var(--c-lvl1) h s calc(l + 6 * var(--color-scheme-dark))
        );
      }
    }

    &.selectable {
      &:hover {
        cursor: pointer;
      }

      &:active,
      &.active {
        background-color: hsl(
          from var(--c-lvl1) h s calc(l + 12 * var(--color-scheme-dark))
        );
      }
    }

    > .expander {
      color: var(--c-primary);
      animation: pulse 1000ms 2;

      transition: scale var(--hover-duration) ease-in-out,
        rotate 125ms cubic-bezier(0.65, 0.05, 0.36, 1);

      vertical-align: middle;
      rotate: 90deg;
    }
  }

  .row-details {
    border-bottom: var(--border-thickness) solid var(--c-lvl4);
  }
}
</style>

<style>
/** Utility classes for row cells. */
.row .row-data {
  .center {
    justify-self: center;
  }

  .end {
    justify-self: end;
  }

  .hide {
    visibility: hidden;
  }

  img.token {
    width: 1.5rem;
    height: 1.5rem;
  }

  /* These direct divs are most likely your individual cells. */
  > div {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
