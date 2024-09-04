<script setup lang="ts">
const showFullscreen = defineModel<boolean>({ required: true });

const { chart, target = null } = defineProps<{
  chart: IChartApi | undefined;
  target: HTMLElement | null;
}>();

// Fullscreen
let originalHeight = 0;
let originalWidth = 0;

function onEnterBefore() {
  const parent = chart!.chartElement().parentElement;
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
