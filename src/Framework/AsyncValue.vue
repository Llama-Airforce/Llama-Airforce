<script setup lang="ts">
import { unit as unitF } from "@/Util";

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
  inline = true,
} = defineProps<{
  value?: number | null;
  type?: "dollar" | "percentage";
  precision?: number | ((x: number) => number);
  showUnit?: boolean;
  showSymbol?: boolean;
  showZero?: boolean;
  inline?: boolean;
}>();

// Refs
const rod = ref("|");

// Getters
const presentation = computed((): string => {
  if (!value) {
    if (value === 0 && showZero) {
      return "0";
    }

    if (value === null || value === undefined) {
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
  if (precision === Infinity) {
    return "";
  }

  if (!value || !type || !isFinite(value)) {
    return showUnit && type ? unitF(0, type) : "";
  }

  return unitF(value, type);
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
  <div
    v-if="!inline"
    class="async-value"
  >
    {{ showSymbol && type === "dollar" ? "$" : "" }}{{ presentation
    }}{{ showUnit ? unit : "" }}
  </div>

  <template v-else>
    {{ showSymbol && type === "dollar" ? "$" : "" }}{{ presentation
    }}{{ showUnit ? unit : "" }}
  </template>
</template>
