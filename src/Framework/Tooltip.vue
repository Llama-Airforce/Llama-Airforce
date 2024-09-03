<script setup lang="ts">
const { icon = "" } = defineProps<{
  icon?: string;
}>();

// Emits
const emit = defineEmits<{
  show: [boolean];
}>();

// Refs
const show = ref(false);

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

watch(show, (show) => {
  emit("show", show);

  if (show) {
    void nextTick(() => {
      adjustPosition();
    });
  }
});

// Show & Hide with a slight delay.
let hideTimeout: ReturnType<typeof setTimeout> | undefined;

function showTooltip() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = undefined;
  }

  show.value = true;
}

function hideTooltip() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }

  hideTimeout = setTimeout(() => {
    show.value = false;
    hideTimeout = undefined;
  }, 50);
}

// Adjust positions such that it fits on screen.
onMounted(() => {
  adjustPosition();
  window.addEventListener("resize", adjustPosition);
});

onUnmounted(() => {
  window.removeEventListener("resize", adjustPosition);
});

function adjustPosition() {
  if (!triggerRef.value || !contentRef.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const contentRect = contentRef.value.getBoundingClientRect();

  const MARGIN = 14;

  // Clamp tooltip to fit in window height.
  const topMin = MARGIN;
  const topMax = window.innerHeight - contentRect.height - MARGIN;
  const top = Math.min(
    Math.max(topMin, triggerRect.top - contentRect.height - MARGIN),
    topMax
  );

  // Clamp tooltip to fit in window width.
  const leftMin = MARGIN;
  const leftMax = window.innerWidth - contentRect.width - MARGIN;
  const left = Math.min(
    Math.max(
      leftMin,
      triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
    ),
    leftMax
  );

  contentRef.value.style.top = `${top}px`;
  contentRef.value.style.left = `${left}px`;
}
</script>

<template>
  <div
    class="tooltip"
    :class="{ show }"
  >
    <div
      ref="triggerRef"
      class="trigger"
      @mouseover="showTooltip"
      @mouseleave="hideTooltip"
      @touchstart="showTooltip"
      @touchend="hideTooltip"
    >
      <slot name="trigger">
        <i
          v-if="icon"
          :class="icon"
        ></i>

        <img
          v-else
          src="@/Assets/Icons/question.png"
        />
      </slot>
    </div>

    <div
      ref="contentRef"
      class="content"
      @mouseover="showTooltip"
      @mouseleave="hideTooltip"
      @touchstart="showTooltip"
      @touchend="hideTooltip"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tooltip {
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

  .content {
    visibility: hidden;
    position: fixed;
    z-index: 1;

    display: flex;
    flex-direction: column;

    background-color: var(--c-lvl1);
    border: solid var(--border-thickness) var(--c-lvl4);
    border-radius: var(--border-radius);
    box-shadow: var(--tooltip-box-shadow);
    opacity: 0;
    font-size: 0.875rem;
    overflow: hidden;
    white-space: nowrap;
    padding: 1rem;

    transition: opacity 0.15s ease, visibility 0s 0.15s;

    @media only screen and (max-width: 1280px) {
      white-space: normal;
    }
  }

  &.show {
    .content {
      visibility: visible;
      opacity: 1;
      transition: opacity 0.15s ease, visibility 0s;
    }
  }
}
</style>
