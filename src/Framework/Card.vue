<script setup lang="ts">
/**
 * Note: The component automatically applies a 'stack-actions' class for
 * responsive layout when window width <= 1280px. This stacks secondary
 * actions below the main header.
 */
const {
  title = "",
  compact = false,
  collapsible = false,
  collapsed = false,
  loading = null,
} = defineProps<{
  title?: string;
  compact?: boolean;

  collapsible?: boolean;
  collapsed?: boolean;

  loading?: boolean | null;
}>();

const slots = useSlots();

const hasTitle = computed(() => title || slots["title"]);
const hasActions = computed(() => slots["actions"]);
const hasActionsSecondary = computed(() => slots["actions-secondary"]);

const showHeader = computed(
  () => title || slots.title || hasActions.value || hasActionsSecondary.value
);

// Imitate a media query which can't be combined with a normal CSS selector.
const { width } = useWindowSize();
const stackActions = computed(() => width.value <= 1280);
</script>

<template>
  <div
    class="card"
    :class="{
      loading,
      'loading-backdrop': loading !== null,
      'stack-actions': stackActions,
    }"
    :inert="!!loading"
  >
    <div
      v-if="showHeader"
      class="card-header"
      :class="{ collapsible }"
    >
      <div
        v-if="hasTitle"
        class="card-title"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <div
        v-if="hasActionsSecondary"
        class="card-actions-secondary"
      >
        <slot name="actions-secondary"></slot>
      </div>

      <div
        v-if="hasActions"
        class="card-actions"
      >
        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Just for margin reasons -->
    <div
      v-else
      class="card-no-header"
      :class="{ compact }"
    ></div>

    <div
      class="card-body"
      :class="{ compact, collapsed }"
    >
      <Spinner
        v-if="loading !== null"
        :loading
      />
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: var(--card-width);

  display: flex;
  flex-direction: column;
  flex-grow: 1;

  background: var(--c-lvl1);
  border-radius: var(--border-radius);
  box-shadow: var(--container-box-shadow);

  --header-column-title: 1fr;
  --header-column-actions: auto;
  --header-column-actions-secondary: auto;

  .card-header {
    display: grid;
    grid-template-columns:
      var(--header-column-title)
      var(--header-column-actions);

    gap: 1rem;
    align-items: center;

    font-size: 0.875rem;
    min-height: 2.5rem;
    margin-block: var(--card-margin-block);
    margin-inline: var(--card-margin-inline);

    /*
     * Can't use subgrids as they require grid-column: span N; inside wrapper divs,
     * where N is the number of action slot divs. While possible with JavaScript
     * (e.g., setting var(--num-actions)), using display: content; is simpler.
     */
    > .card-actions,
    > .card-actions-secondary {
      display: contents;
    }

    &:has(.card-actions-secondary) {
      grid-template-columns:
        var(--header-column-title)
        var(--header-column-actions-secondary)
        var(--header-column-actions);
    }

    /*
     * When card-body overflows it shrinks tab-headers to 2.5rem which is too small
     * Therefore to make it all fit, we shrink the tab header padding to fit in 2.5rem.
     */
    &:has(.tab-view):deep(.tab-header) {
      padding: calc(0.5rem - 1px) 1rem 0.75rem 1rem;
    }

    &.collapsible {
      margin-bottom: var(--card-margin-block);
    }

    > .card-title {
      font-size: 1.125rem;
      font-weight: bold;
      color: var(--c-text);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  > .card-no-header {
    margin-top: var(--card-margin-block);

    &.compact {
      margin-top: 0;
    }
  }

  > .card-body {
    position: relative;

    height: var(--card-body-height);
    overflow: var(--card-body-overflow);

    flex-grow: 1;
    margin: 0 var(--card-margin-inline) var(--card-margin-block)
      var(--card-margin-inline);

    @media only screen and (max-width: 1280px) {
      margin: 0 var(--card-margin-inline) var(--card-margin-block)
        var(--card-margin-inline);
    }

    &.compact {
      margin: 0;
    }

    &.collapsed {
      margin: 0 var(--card-margin-inline);
    }

    &:has(.no-data) {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:has(.table) {
      overflow-y: auto;
    }

    &:has(.vue-apexcharts) {
      margin-top: -1rem !important;
      overflow-x: clip;
    }

    > .spinner {
      position: absolute;
      inset: 0;
      margin: auto auto;
      z-index: 2;
    }
  }

  /*
   * In mobile view or forced stack mode:
   * 1. Secondary action columns are removed from the parent grid.
   * 2. The secondary action div occupies its own row.
   * 3. It uses the columns that were removed from the parent grid.
   */
  &.stack-actions .card-header:has(.card-actions-secondary) {
    row-gap: 0.5rem;
    grid-template-columns:
      var(--header-column-title)
      var(--header-column-actions);

    .card-actions-secondary {
      display: grid;
      grid-row: 2;
      grid-column: 1 / -1;

      grid-template-columns: var(--header-column-actions-secondary);
    }
  }
}
</style>
