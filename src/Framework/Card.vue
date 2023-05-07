<template>
  <div class="card">
    <Spinner
      v-if="loading"
      class="loader"
    ></Spinner>

    <div
      class="card-container"
      :class="{ loading }"
    >
      <div
        v-if="title"
        class="card-header"
        :class="{ collapsible }"
      >
        <div class="text">
          <i
            v-if="icon"
            class="icon"
            :class="icon"
          ></i>
          {{ title }}
        </div>
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
  </div>
</template>

<script setup lang="ts">
import { Spinner } from "@/Framework";

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
  loading = false,
} = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card {
  position: relative;

  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;

  $card-margin-width: 1.125rem;
  $card-margin-height: 0.875rem;

  > .loader {
    position: absolute;
    inset: 0;
    margin: auto auto;
  }

  > .card-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: stretch;

    background: var(--c-lvl1);
    border-radius: var(--border-radius);
    box-shadow: var(--container-box-shadow);

    &.loading {
      opacity: 0.33;
    }

    > .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      height: 2.5rem;
      margin: $card-margin-height $card-margin-width;

      &.collapsible {
        margin-bottom: $card-margin-height;
      }

      .icon {
        font-size: 1.125rem;
        color: var(--c-primary);
        padding-right: 0.5rem;
      }

      .text {
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
    }
  }
}
</style>
