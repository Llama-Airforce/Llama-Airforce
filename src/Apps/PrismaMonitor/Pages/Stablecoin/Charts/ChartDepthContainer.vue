<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<script setup lang="ts">
import { useData } from "@/Framework";
import MkUsdService from "@PM/Services/MkUsdService";
import { getHost } from "@/Services/Host";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";

const mkUsdService = new MkUsdService(getHost());

// Data
const { loading, data } = useData(
  () => mkUsdService.getCurvePoolDepth("ethereum").then((x) => x.depth),
  []
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
</style>
