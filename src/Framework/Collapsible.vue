<template>
  <component
    :is="tag"
    ref="root"
    data-height-collapsible
    :data-collapse-state="collapseState"
  >
    <slot :state="collapseState" />
  </component>
</template>

<script
  setup
  lang="ts"
>
import { onBeforeUnmount, onMounted, watch } from "vue";
import { $ref, $computed } from "vue/macros";

// Ported from: https://github.com/kunukn/vue-height-collapsible

// Constants
const COLLAPSED = "collapsed";
const COLLAPSING = "collapsing";
const EXPANDING = "expanding";
const EXPANDED = "expanded";
const collapseHeight = "0px";
const nextFrame = (callback: FrameRequestCallback) =>
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });

// Props
interface Props {
  isOpen?: boolean;
  overflowOnExpanded?: boolean;
  tag?: string;
  transition?: string;
}

const {
  isOpen = true,
  overflowOnExpanded = false,
  tag = "div",
  transition = null,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "error", evt: { type: string; msg: string }): void;
  (e: "update", evt: { state: string; height: string }): void;
}>();

// Vars
let collapseState: string = $ref(COLLAPSED);
let isMounted = $ref(false);

// Refs
const root = $ref<HTMLElement | null>(null);

const elementHeight = $computed(() => `${root?.scrollHeight ?? 0}px`);
const overflow = $computed(() =>
  collapseState === EXPANDED && overflowOnExpanded ? "" : "hidden"
);

// Hooks
onMounted((): void => {
  if (isOpen) {
    setExpanded();
  } else {
    setCollapsed();
  }

  if (root) {
    if (transition) {
      root.style.transition = transition;
    }

    root.addEventListener("transitionend", (evt) => onTransitionEnd(evt));
  }
  isMounted = true;
});

onBeforeUnmount((): void => {
  if (!root) {
    return;
  }

  root.removeEventListener("transitionend", (evt) => onTransitionEnd(evt));
});

// Watches
watch(
  () => isOpen,
  (current, previous): void => {
    if (!isMounted) {
      emit("error", {
        type: "isOpen",
        msg: "not mounted yet",
      });
      return;
    }

    if (current && !previous) setExpanding();
    if (!current && previous) setCollapsing();
  }
);

watch(
  () => transition,
  (current, previous): void => {
    if (current !== previous && root) {
      root.style.transition = current ?? "";
    }
  }
);

// Methods
const setCollapsed = (): void => {
  if (!root) return;

  collapseState = COLLAPSED;

  const style = root.style;
  style.overflowY = overflow;
  style.height = collapseHeight;
  style.visibility = "hidden"; // inert

  emit("update", { state: COLLAPSED, height: collapseHeight });
};

const setExpanded = (): void => {
  if (!root) return;
  collapseState = EXPANDED;

  const style = root.style;
  style.overflowY = overflow;
  style.height = "";
  style.visibility = "";

  emit("update", {
    state: EXPANDED,
    height: elementHeight,
  });
};

const setCollapsing = (): void => {
  if (!root) return;

  collapseState = COLLAPSING;
  const height = elementHeight;

  const style = root.style;
  style.overflowY = overflow;
  style.height = height;
  style.visibility = "";

  emit("update", { state: COLLAPSING, height });

  nextFrame(() => {
    if (!root) return;
    if (collapseState !== COLLAPSING) return;

    root.style.height = collapseHeight;
  });
};

const setExpanding = (): void => {
  if (!root) return;

  emit("update", { state: EXPANDING, height: "" });
  collapseState = EXPANDING;

  nextFrame(() => {
    if (!root) return;
    if (collapseState !== EXPANDING) return;

    const style = root.style;
    style.overflowY = overflow;
    style.height = elementHeight;
    style.visibility = "";
  });
};

const onTransitionEnd = (event: TransitionEvent): void => {
  if (event.propertyName === "height" && event.target === root) {
    if (elementHeight === root?.style.height) {
      if (collapseState === EXPANDING) setExpanded();
    } else {
      if (collapseState === COLLAPSING) setCollapsed();
    }
  }
};
</script>

<style
  lang="scss"
  scoped
>
[data-height-collapsible] {
  // Disabled (0ms from 280ms) for now for performance reasons.
  transition: height 0ms cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
