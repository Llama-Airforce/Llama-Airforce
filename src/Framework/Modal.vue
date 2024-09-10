<script setup lang="ts">
const { show = false } = defineProps<{
  show?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const onEscape = (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    emit("close");
  }
};

// Hooks
onMounted(() => {
  document.addEventListener("keydown", onEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onEscape);
});

// Watches
watch(
  () => show,
  (show) => {
    document.body.style.overflow = show ? "hidden" : "";
  }
);
</script>

<template>
  <Teleport to="body">
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
  </Teleport>
</template>

<style scoped>
@keyframes fadeOpacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.6;
  }
}

@keyframes fadeBlur {
  from {
    backdrop-filter: blur(0px);
  }
  to {
    backdrop-filter: blur(10px);
  }
}

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
  line-height: 1.5;

  backdrop-filter: blur(0px);
  animation: fadeBlur 0.5s forwards; /* Apply the animation */

  .modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 1;

    animation: fadeOpacity 0.5s forwards; /* Apply the animation */
  }

  .modal-popup {
    z-index: 2;
    overflow: hidden;
  }
}
</style>
