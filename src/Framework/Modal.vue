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
// Props
interface Props {
  show?: boolean;
}

const { show = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.modal {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.6;
    z-index: 1;
  }

  .modal-popup {
    border: solid 2px #35353b;
    z-index: 2;
    overflow: hidden;
  }
}
</style>
