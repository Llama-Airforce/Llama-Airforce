<script setup lang="ts">
import { StableService } from "@PM/Services";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";
import { useSettingsStore } from "@PM/Stores";

// Stores
const storeSettings = useSettingsStore();

// Services
const stableService = new StableService(storeSettings.flavor);

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-stable-pool-depth"],
  queryFn: () =>
    stableService.getCurvePoolDepth("ethereum").then((x) => x.depth),
  initialData: [],
  initialDataUpdatedAt: 0,
});
</script>

<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
</style>
