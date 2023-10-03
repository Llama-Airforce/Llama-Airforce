<template>
  <div class="kpis">
    <KPI
      label="mkUSD price"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.price"
        :precision="4"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Total supply"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.supply"
        :precision="2"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="24h Volume (Curve)"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.volume"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Aggregate -2% Depth (Curve)"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.depth"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AsyncValue, KPI } from "@/Framework";
import { getHost } from "@/Services/Host";
import PrismaService, { type StableKPI } from "@PM/Services/PrismaService";

const prismaService = new PrismaService(getHost());

// Refs
const data = ref<StableKPI | null>(null);

// Hooks
onMounted(async (): Promise<void> => {
  try {
    data.value = await prismaService
      .getStableCoinKPI("ethereum")
      .then((x) => x.info);
  } catch {
    data.value = null;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpis {
  display: flex;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr 1fr;
  }
}
</style>
