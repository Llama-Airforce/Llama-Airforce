<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<script setup lang="ts">
import { usePromise } from "@/Framework";
import { getHost, MkUsdService } from "@PM/Services";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";

const mkUsdService = new MkUsdService(getHost());

// Data
const { loading, data } = usePromise(
  () => mkUsdService.getCurvePoolDepth("ethereum").then((x) => x.depth),
  []
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
</style>
