<script setup lang="ts">
type Size = "small" | "medium" | "large" | "huge";

const { loading, size = "medium" } = defineProps<{
  loading: boolean;
  size?: Size;
}>();
</script>

<template>
  <div
    class="spinner"
    :class="[{ loading }, size]"
  >
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  position: relative;

  --size: 80px;

  &.small {
    --size: 40px;
  }

  &.medium {
    --size: 60px;
  }

  &.large {
    --size: 80px;
  }

  &.huge {
    --size: 100px;
  }

  width: var(--size);
  height: var(--size);

  div {
    position: absolute;
    border: 4px solid var(--c-text);
    border-width: calc(var(--size) * 0.05);
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  div:nth-child(2) {
    animation-delay: -0.5s;
  }

  &:not(&.loading) {
    animation-name: fadeOutSpinner;
    animation-duration: var(--hover-duration);
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }

  &.loading {
    animation-name: fadeInSpinner;
    animation-duration: var(--hover-duration);
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }
}

@keyframes fadeInSpinner {
  from {
    visibility: visible;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOutSpinner {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes lds-ripple {
  0% {
    top: calc(var(--size) * 0.45);
    left: calc(var(--size) * 0.45);
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: calc(var(--size) * 0.9);
    height: calc(var(--size) * 0.9);
    opacity: 0;
  }
}
</style>
