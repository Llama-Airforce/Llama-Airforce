<script setup lang="ts">
const {
  title = "",
  icon = "",
  compact = false,
  collapsible = false,
  collapsed = false,
  loading = false,
} = defineProps<{
  title?: string;
  icon?: string;
  compact?: boolean;

  collapsible?: boolean;
  collapsed?: boolean;

  loading?: boolean;
}>();

const slots = useSlots();

const hasActions = computed(() => slots["actions"]);
const hasActionsSecondary = computed(() => slots["actions-secondary"]);

const showHeader = computed(
  () => title || slots.title || hasActions.value || hasActionsSecondary.value
);
</script>

<template>
  <div
    class="card"
    :class="{ loading }"
    :inert="!!loading"
  >
    <Spinner
      v-if="loading !== null"
      class="loader"
      :class="{ loading }"
    ></Spinner>

    <div
      v-if="showHeader"
      class="card-header"
      :class="{ collapsible }"
    >
      <slot name="title">
        <div
          v-if="title"
          class="card-title"
        >
          <i
            v-if="icon"
            class="icon"
            :class="icon"
          ></i>
          {{ title }}
        </div>
      </slot>

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
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card {
  position: relative;

  display: flex;
  flex-direction: column;
  flex-grow: 1;

  background: var(--c-lvl1);
  border-radius: var(--border-radius);
  box-shadow: var(--container-box-shadow);

  --header-column-title: 1fr;
  --header-column-actions: auto;
  --header-column-actions-secondary: auto;

  @include loading-backdrop();

  > .loader {
    position: absolute;
    inset: 0;
    margin: auto auto;
    z-index: 2;

    @include loading-spinner();
  }

  .card-header {
    container-type: inline-size;

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

      /*
       * In mobile view:
       * 1. Secondary action columns are removed from the parent grid.
       * 2. The secondary action div occupies its own row.
       * 3. It uses the columns that were removed from the parent grid.
       */
      @container (width < 550px) {
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

    &.collapsible {
      margin-bottom: var(--card-margin-block);
    }

    > .icon {
      font-size: 1.125rem;
      color: var(--c-primary);
      padding-right: 0.5rem;
    }

    :deep(> .card-title) {
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
    display: flex;
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

    &:has(.table) {
      overflow-y: auto;
    }

    &:has(.chart) {
      display: block;
    }

    &:has(.vue-apexcharts) {
      margin-top: -1rem !important;
      overflow-x: clip;
    }
  }
}
</style>
