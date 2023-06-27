<template>
  <div class="ranges">
    <ButtonToggle
      v-for="range in timeRanges"
      :key="range"
      :model-value="storeMonitor.timeRange === range"
      :value="t(range)"
      @click="onRange(range)"
    >
    </ButtonToggle>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ButtonToggle } from "@/Framework";
import { type TimeRange, timeRanges } from "@CM/Models/TimeRange";
import { useMonitorStore } from "@CM/Pages/Pool/Store";
import type { SocketPool } from "@CM/Services/Sockets";
import { TimeRangeService } from "@CM/Services";

const { t } = useI18n();

// Refs
const storeMonitor = useMonitorStore();

// Events
const onRange = (range: TimeRange) => {
  // Don't do anything if we're not changing the range.
  if (storeMonitor.timeRange === range) {
    return;
  }

  storeMonitor.timeRange = range;

  if (storeMonitor.pair) {
    const timeRangeService = new TimeRangeService(
      storeMonitor.socketPool as SocketPool
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
    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
day: Day
week: Week
month: Month
</i18n>
