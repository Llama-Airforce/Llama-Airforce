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
      label="Share of the ETH LSD market"
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

<script setup lang="ts">
import { watch } from "vue";
import { AsyncValue, KPI, usePromise } from "@/Framework";
import { getHost } from "@/Services/Host";
import CollateralService from "@PM/Services/CollateralService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

const collateralService = new CollateralService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Data
const { data, load } = usePromise(() => {
  if (vault) {
    return collateralService
      .getCollateralInfo("ethereum", vault.collateral)
      .then((x) => x.info);
  } else {
    return Promise.resolve(null);
  }
}, null);

// Watches
watch(() => vault, load);
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
