<script setup lang="ts">
import { CollateralService, type TroveManagerDetails } from "@PM/Services";
import { useSettingsStore } from "@PM/Stores";

// Stores
const storeSettings = useSettingsStore();

// Services
const collateralService = new CollateralService(storeSettings.flavor);

const { vault = null } = defineProps<{
  vault?: TroveManagerDetails | null;
}>();

// Data
const { data } = useQuery({
  queryKey: ["prisma-collateral-info", computed(() => vault?.address)] as const,
  queryFn: ({ queryKey: [, collateral] }) => {
    if (collateral) {
      return collateralService
        .getCollateralInfo("ethereum", collateral)
        .then((x) => x.info);
    } else {
      return Promise.resolve(null);
    }
  },
  initialData: null,
  initialDataUpdatedAt: 0,
});
</script>

<template>
  <div class="kpis">
    <KPI
      label="Oracle price"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.price"
        :precision="2"
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
      label="TVL"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.tvl"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Share of the collateral market"
      :has-value="!!data"
    >
      <AsyncValue
        v-if="data"
        :value="data.share"
        :precision="1"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Full risk analysis by Prisma Risk team"
      :has-value="!!data"
    >
      <a
        v-if="data"
        :href="data.risk"
      >
        Risk Report
      </a>
    </KPI>
  </div>
</template>

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
