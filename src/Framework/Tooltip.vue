<template>
  <Popper
    class="tooltip"
    :show="show"
  >
    <div
      @mouseover="show = true"
      @mouseleave="show = false"
    >
      <slot name="item">
        <i
          v-if="icon"
          :class="icon"
        ></i>

        <img
          v-else
          src="@/Assets/question.png"
        />
      </slot>
    </div>

    <template #content>
      <slot></slot>
    </template>
  </Popper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Popper from "vue3-popper";

// Props
interface Props {
  icon?: string;
}

const { icon = "" } = defineProps<Props>();

// Refs
const show = ref(false);
</script>

<style lang="scss" scoped>
.tooltip {
  display: flex;
  border: 0 !important;
  margin: 0 !important;

  img {
    object-fit: scale-down;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;

    @media only screen and (max-width: 1280px) {
      height: 20px;
    }
  }

  :deep(.popper) {
    background-color: var(--c-lvl1);
    border-radius: 5px;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
    font-size: 0.875rem;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    z-index: 12;
    transition: 0.15s ease all;
    padding: 1rem;

    @media only screen and (max-width: 1280px) {
      white-space: normal;
      width: 85%;
    }
  }
}
</style>
