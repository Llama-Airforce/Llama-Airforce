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
      v-if="title || $slots.title || $slots.actions"
      class="card-header"
      :class="{ collapsible }"
    >
      <slot name="title">
        <div
          v-if="title"
          class="title"
        >
          <i
            v-if="icon"
            class="icon"
            :class="icon"
          ></i>
          {{ title }}
        </div>
      </slot>

      <slot name="actions"></slot>
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

<script setup lang="ts">
// Props
interface Props {
  title?: string;
  icon?: string;
  compact?: boolean;

  collapsible?: boolean;
  collapsed?: boolean;

  loading?: boolean;
}

const {
  title = "",
  icon = "",
  compact = false,
  collapsible = false,
  collapsed = false,
  loading = null,
} = defineProps<Props>();
</script>

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

  $card-margin-width: 1.125rem;
  $card-margin-height: 0.875rem;

  --header-columns: 1fr auto;

  @include loading-backdrop();

  > .loader {
    position: absolute;
    inset: 0;
    margin: auto auto;
    z-index: 2;

    @include loading-spinner();
  }

  :deep(.card-header) {
    display: grid;
    grid-template-columns: var(--header-columns);
    gap: 1rem;
    align-items: center;

    font-size: 0.875rem;
    height: 2.5rem;
    margin: $card-margin-height $card-margin-width;

    &.collapsible {
      margin-bottom: $card-margin-height;
    }

    > .icon {
      font-size: 1.125rem;
      color: var(--c-primary);
      padding-right: 0.5rem;
    }

    > .title {
      font-size: 1.125rem;
      font-weight: bold;
      color: var(--c-text);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  > .card-no-header {
    margin-top: $card-margin-height;

    &.compact {
      margin-top: 0;
    }
  }

  > .card-body {
    display: flex;
    flex-grow: 1;
    margin: 0 $card-margin-width $card-margin-height $card-margin-width;

    @media only screen and (max-width: 1280px) {
      margin: 0 $card-margin-width $card-margin-height $card-margin-width;
    }

    &.compact {
      margin: 0;
    }

    &.collapsed {
      margin: 0 $card-margin-width;
    }

    &:has(.datatable) {
      overflow-y: auto;
    }
  }

  /** Helpful style in conjuction with ModalFullscreen, esp for charts. */
  &.fullscreen {
    width: 100%;

    .card-container {
      height: 100%;
      overflow: hidden;

      .card-body {
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
