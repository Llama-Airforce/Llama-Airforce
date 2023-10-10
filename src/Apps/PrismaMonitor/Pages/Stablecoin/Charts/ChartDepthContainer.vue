<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useData } from "@/Framework";
import PrismaService from "@PM/Services/PrismaService";
import { getHost } from "@/Services/Host";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";

const prismaService = new PrismaService(getHost());

// Data
const { loading, data, loadData } = useData(
  () => prismaService.getCurvePoolDepth("ethereum").then((x) => x.depth),
  []
);

onMounted(() => void loadData());
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
</style>
