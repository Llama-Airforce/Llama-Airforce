<script setup lang="ts" generic="T">
const open = defineModel<boolean>("open", { required: true });

const { options, direction = "down" } = defineProps<{
  options: T[];
  direction?: "up" | "down";
}>();

const emit = defineEmits<{
  select: [option: T];
}>();

// (internal) keyboard selection
const selectedIndex = ref(-1);
watch([() => options, open], () => {
  selectedIndex.value = -1;
});

const handleKeydown = (e: KeyboardEvent) => {
  if (!open.value) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % options.length;
      break;

    case "ArrowUp":
      e.preventDefault();
      selectedIndex.value =
        selectedIndex.value <= 0 ? options.length - 1 : selectedIndex.value - 1;
      break;

    case "Enter":
      if (selectedIndex.value >= 0) {
        emit("select", options[selectedIndex.value]);
      }
      break;

    case "Escape":
      selectedIndex.value = -1;
      open.value = false;
      break;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div
    class="options-list"
    :class="[{ open }, direction]"
  >
    <div
      v-for="(option, idx) of options"
      :key="idx"
      class="option-wrapper"
      :class="{ selected: idx === selectedIndex }"
      @click.stop="emit('select', option)"
    >
      <slot
        name="option"
        :option
        :idx
      >
        {{ option }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
.options-list {
  color: var(--c-text);
  overflow: hidden;
  position: absolute;
  left: 0;
  z-index: 2;
  min-width: var(--options-min-width, 100%);
  font-size: 1rem;

  background: var(--c-lvl1);
  box-shadow: var(--options-box-shadow);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);

  &:not(.open) {
    display: none;
  }

  &.up {
    bottom: 120%; /* Items will move upwards. */

    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }
}

.option-wrapper {
  color: var(--c-text);
  cursor: pointer;

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  border-bottom: 1px solid var(--c-lvl3);
  padding: 0.5rem 0.75rem;

  &:hover,
  &.selected {
    background-color: var(--c-primary);
  }

  &:last-child {
    border-bottom: 0;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
}
</style>
