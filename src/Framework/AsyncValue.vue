<template>
  {{ showSymbol && type === "dollar" ? "$" : "" }}{{ presentation
  }}{{ showUnit ? unit : "" }}
</template>

<script
  setup
  lang="ts"
>
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { unit as unitF, round } from "@/Util/NumberHelper";
import { isFinite } from "lodash";

// Props
interface Props {
  value?: number | null;
  type?: "dollar" | "percentage";
  precision?: number;
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

// Vars
const rodChars = "|/-\\";
let rod = $ref("|");
let rodIndex = 0;
let rodTimer = 0;

// Getters
const presentation = $computed((): string => {
  if (!value) {
    if (value === 0 && showZero) {
      return "0";
    }

    if (value === null || value === undefined) {
      return rod;
    }

    return "?";
  }

  return round(value, precision, type ?? "");
});

const unit = $computed((): string => {
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
      rod = rodChars[rodIndex];
    };

    rodTimer = window.setInterval(updateRod, 250);
  },
  { immediate: true }
);
</script>
