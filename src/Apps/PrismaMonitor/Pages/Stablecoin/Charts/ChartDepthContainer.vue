<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<script setup lang="ts">
import { getHost, StableService } from "@PM/Services";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";
import { useSettingsStore } from "@PM/Stores";

// Stores
const storeSettings = useSettingsStore();

// Services
const stableService = new StableService(getHost(), storeSettings.flavor);

// Data
const { loading, data } = usePromise(
  () => stableService.getCurvePoolDepth("ethereum").then((x) => x.depth),
  []
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
</style>
