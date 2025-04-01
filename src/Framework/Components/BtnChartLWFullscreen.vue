<script setup lang="ts">
const fullscreen = ref(false);

const { chart, target = null } = defineProps<{
  chart: IChartApi | undefined;
  target?: ComponentPublicInstance | null;
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
    @click="fullscreen = !fullscreen"
  >
    <LucideMaximize v-if="!fullscreen" />
    <LucideMinimize v-else />

    <ModalFullscreen
      :target="target?.$el"
      :show="fullscreen"
      @close="fullscreen = false"
      @enter-before="onEnterBefore"
      @exit="onExit"
    />
  </Button>
</template>
