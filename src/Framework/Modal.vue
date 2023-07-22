<template>
  <div
    v-if="show"
    class="modal"
  >
    <div
      class="modal-mask"
      @click="emit('close')"
    ></div>

    <div class="modal-popup">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";

// Props
interface Props {
  show?: boolean;
}

const { show = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
}>();

// Watches
watch(
  () => show,
  (newShow) => {
    document.body.style.overflow = newShow ? "hidden" : "";
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.modal {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;

  z-index: 100;

  font-size: 0.875rem;
  font-weight: var(--font-weight);
  line-height: 1.5;

  .modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.6;
    z-index: 1;
  }

  .modal-popup {
    border: solid var(--border-thickness) var(--c-lvl4);
    z-index: 2;
    overflow: hidden;
  }
}
</style>
