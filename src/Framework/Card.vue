<template>
  <div class="card">
    <div class="card-container">
      <div
        v-if="title"
        class="card-header"
        :class="{ collapsible }"
      >
        <i
          v-if="icon"
          class="icon"
          :class="icon"
        ></i>
        <div class="text">{{ title }}</div>
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
// Props
interface Props {
  title?: string;
  icon?: string;
  compact?: boolean;

  collapsible?: boolean;
  collapsed?: boolean;
}

const {
  title = "",
  icon = "",
  compact = false,
  collapsible = false,
  collapsed = false,
} = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.card {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  width: 100%;

  $card-margin: 1rem;
  $card-margin-bottom: 0.75rem;

  > .card-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: stretch;
    background: $background-color-widget;

    > .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: $card-margin $card-margin $card-margin-bottom $card-margin;

      &.collapsible {
        margin-bottom: $card-margin;
      }

      .icon {
        font-size: 1.25rem;
        color: $blue;
        padding-right: 0.75rem;
      }

      .text {
        font-size: 1.25rem;
        font-weight: bold;
        color: white;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    > .card-no-header {
      margin-top: $card-margin-bottom;

      &.compact {
        margin-top: 0;
      }
    }

    > .card-body {
      display: flex;
      flex-grow: 1;
      margin: 0 $card-margin $card-margin-bottom $card-margin;

      @media only screen and (max-width: 1280px) {
        margin: 0 $card-margin $card-margin-bottom $card-margin;
      }

      &.compact {
        margin: 0;
      }

      &.collapsed {
        margin: 0 $card-margin;
      }
    }
  }
}
</style>
