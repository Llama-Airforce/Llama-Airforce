<template>
  <Button
    :disabled="!chart"
    @click="showFullscreen = !showFullscreen"
  >
    <i class="fas fa-expand"></i>

    <ModalFullscreen
      :target
      :show="showFullscreen"
      @close="showFullscreen = false"
      @enter-before="onEnterBefore"
      @exit="onExit"
    >
    </ModalFullscreen>
  </Button>
</template>

<script setup lang="ts">
// Props
interface Props {
  chart: IChartApi | undefined;
  target: HTMLElement | undefined;
}

const { chart, target } = defineProps<Props>();

// Toggle
const showFullscreen = defineModel<boolean>({ required: true });

// Fullscreen
let originalHeight = 0;
let originalWidth = 0;

function onEnterBefore() {
  const parent = chart!.chartElement()?.parentElement;
  originalHeight = parent?.clientHeight ?? 0;
  originalWidth = parent?.clientWidth ?? 0;
}

function onExit() {
  chart!.applyOptions({
    height: originalHeight,
    width: originalWidth,
  });
}
</script>
