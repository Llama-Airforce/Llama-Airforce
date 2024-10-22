<script setup lang="ts">
import { StableService } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";
import { stableSymbol } from "@PM/Models/Flavor";

// Stores
const storeSettings = useSettingsStore();

// Services
const stableService = new StableService(storeSettings.flavor);

// Data
const { data } = useQuery({
  queryKey: ["prisma-stable-kpi"],
  queryFn: () => stableService.getStableCoinKPI("ethereum").then((x) => x.info),
});
</script>

<template>
  <div class="kpis">
    <KPI
      :label="`${stableSymbol(storeSettings.flavor)} price`"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        type="dollar"
        :value="data.price"
        :precision="4"
      />
    </KPI>

    <KPI
      label="Total supply"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        type="dollar"
        :value="data.supply"
        :precision="2"
      />
    </KPI>

    <KPI
      label="24h Volume (Curve)"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        type="dollar"
        :value="data.volume"
        :precision="1"
      />
    </KPI>

    <KPI
      label="Aggregate -2% Depth (Curve)"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        type="dollar"
        :value="data.depth"
        :precision="1"
      />
    </KPI>
  </div>
</template>

<style scoped>
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
