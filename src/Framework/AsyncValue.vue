<template>
  {{ showSymbol && type === "dollar" ? "$" : "" }}{{ presentation
  }}{{ showUnit ? unit : "" }}
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { isFinite } from "lodash";
import { unit as unitF, round } from "@/Util";

const rodChars = "|/-\\";
let rodIndex = 0;
let rodTimer = 0;

// Props
interface Props {
  value?: number | null;
  type?: "dollar" | "percentage";
  precision?: number | ((x: number) => number);
  showUnit?: boolean;
  showSymbol?: boolean;
  showZero?: boolean;
}

const {
  value = null,
  type = null,
  precision = 2,
  showUnit = true,
  showSymbol = true,
  showZero = false,
} = defineProps<Props>();

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
  if (!isFinite(precision)) {
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
