<script setup lang="ts">
import { unit as unitF } from "@/Utils/Number";

const rodChars = "|/-\\";
let rodIndex = 0;
let rodTimer = 0;

const {
  value = null,
  type = null,
  precision = 2,
  showUnit = true,
  showSymbol = true,
  showZero = false,
} = defineProps<{
  value?: number | null | undefined;
  type?: "dollar" | "percentage";
  precision?: number | ((x: number) => number);
  showUnit?: boolean;
  showSymbol?: boolean;
  showZero?: boolean;
}>();

// Refs
const rod = ref("|");

// Getters
const presentation = computed((): string => {
  if (!value) {
    if (value === 0 && showZero) {
      return "0";
    }

    if (value === null || (value as unknown) === undefined) {
      return rod.value;
    }

    return "?";
  }

  return round(
    value,
    typeof precision === "function" ? precision(value) : precision,
    type ?? ""
  );
});

const unit = computed((): string => {
  if (precision === Infinity || !type) {
    return "";
  }

  if (!value || !isFinite(value)) {
    return showUnit ? unitF(0) : "";
  }

  return unitF(value);
});

// Watches
watch(
  () => value,
  (newValue): void => {
    clearInterval(rodTimer);
    rodIndex = 0;
    if (newValue) {
      return;
    }

    const updateRod = () => {
      rodIndex = (rodIndex + 1) % 4;
      rod.value = rodChars[rodIndex];
    };

    rodTimer = window.setInterval(updateRod, 250);
  },
  { immediate: true }
);
</script>

<template>
  <div class="async-value">
    <span
      v-if="showSymbol && type === 'dollar'"
      class="symbol"
    >
      $
    </span>

    <span class="value">{{ presentation }}</span>

    <span
      v-if="showUnit"
      class="unit"
    >
      {{ unit }}
    </span>

    <span
      v-if="showSymbol && type === 'percentage'"
      class="symbol"
    >
      %
    </span>
  </div>
</template>

<style scoped>
.async-value {
  display: flex;
}

.symbol {
  margin-right: 0.25ch;
}

.unit {
  margin-left: 0.2ch;
}

.symbol {
  --mix-color: calc((1 - var(--color-scheme-dark, 0)) * 255);
  --mix-intensity: calc(
    var(--color-scheme-dark, 0) * 33% + (1 - var(--color-scheme-dark, 0)) * 42%
  );

  color: color-mix(
    in srgb,
    currentColor,
    rgb(var(--mix-color), var(--mix-color), var(--mix-color))
      var(--mix-intensity)
  );
}
</style>
