<template>
  <ChartDepth
    v-for="poolDepth in data"
    :key="poolDepth.name"
    :loading="loading"
    :depth="poolDepth"
  ></ChartDepth>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import PrismaService, {
  type PoolDepth,
} from "@PM/Services/PrismaService";
import { getHost } from "@/Services/Host";
import ChartDepth from "@PM/Pages/Stablecoin/Charts/ChartDepth.vue";

const prismaService = new PrismaService(getHost());

// Refs
const loading = ref(true);
const data = ref<PoolDepth[]>([]);

onMounted(async () => {
  loading.value = true;

  data.value = await prismaService
    .getCurvePoolDepth("ethereum")
    .then((x) => x.depth);
  loading.value = false;
});

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

</style>
