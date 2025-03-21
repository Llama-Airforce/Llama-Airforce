<script setup lang="ts">
import type { DurationType } from "@CM/monitor/socketMonitorCurve";

const { duration = { value: 1, unit: "month" } } = defineProps<{
  duration?: DurationType;
}>();

const emit = defineEmits<{
  select: [option: DurationType];
}>();

// Select
const options: DurationType[] = [
  { value: 1, unit: "hour" },
  { value: 1, unit: "day" },
  { value: 1, unit: "week" },
  { value: 1, unit: "month" },
  { value: 1, unit: "year" },
];

const onSelect = (newOption: DurationType): void => {
  emit("select", newOption);
};
</script>

<template>
  <Select
    :options="options.map((x) => x)"
    :selected="duration"
    @select="onSelect"
  >
    <template #option="{ option }">
      <div class="option">
        <div class="label">{{ option.value }} {{ option.unit }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
