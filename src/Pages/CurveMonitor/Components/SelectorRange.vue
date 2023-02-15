<template>
  <div class="ranges">
    <ButtonToggle
      v-for="range in timeRanges"
      :key="range"
      :model-value="timeRange === range"
      :value="t(range)"
      @click="onRange(range)"
    >
    </ButtonToggle>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { ButtonToggle } from "@/Framework";
import {
  type TimeRange,
  timeRanges,
} from "@/Pages/CurveMonitor/Models/TimeRange";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";

const { t } = useI18n();

const store = useCurveMonitorStore();

// Refs
let timeRange: TimeRange = $ref(store.timeRange);

// Events
const onRange = (range: TimeRange) => {
  // Don't do anything if we're not changing the range.
  if (timeRange === range) {
    return;
  }

  timeRange = range;

  const pairService = new CombinationService(store.socketPool as SocketPool);
  pairService.update([coin[0].label, coin[1].label]);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.ranges {
  display: flex;
  font-size: 0.875rem;

  button {
    height: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
day: Day
week: Week
month: Month
</i18n>
