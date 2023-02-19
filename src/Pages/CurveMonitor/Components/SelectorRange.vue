<template>
  <div class="ranges">
    <ButtonToggle
      v-for="range in timeRanges"
      :key="range"
      :model-value="store.timeRange === range"
      :value="t(range)"
      @click="onRange(range)"
    >
    </ButtonToggle>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ButtonToggle } from "@/Framework";
import {
  type TimeRange,
  timeRanges,
} from "@/Pages/CurveMonitor/Models/TimeRange";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { SocketPool } from "@/Pages/CurveMonitor/Services/Sockets";
import { TimeRangeService } from "@/Pages/CurveMonitor/Services";

const { t } = useI18n();

const store = useCurveMonitorStore();

// Events
const onRange = (range: TimeRange) => {
  // Don't do anything if we're not changing the range.
  if (store.timeRange === range) {
    return;
  }

  store.timeRange = range;

  if (store.pair) {
    const timeRangeService = new TimeRangeService(
      store.socketPool as SocketPool
    );
    timeRangeService.update(range);
  }
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
