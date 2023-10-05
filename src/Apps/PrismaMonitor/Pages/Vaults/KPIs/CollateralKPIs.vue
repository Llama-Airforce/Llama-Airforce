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
      >Risk Report</a>
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AsyncValue, KPI } from "@/Framework";
import { getHost } from "@/Services/Host";
import PrismaService, {type CollateralInfo} from "@PM/Services/PrismaService";
import {type TroveManagerDetails} from "@PM/Services/Socket/TroveOverviewService";

const prismaService = new PrismaService(getHost());

// Props
interface Props {
  vault?: TroveManagerDetails | null;
}
const { vault = null } = defineProps<Props>();

// Refs
const data = ref<CollateralInfo | null>(null);

// Hooks
onMounted(async (): Promise<void> => {
  try {
    data.value = await prismaService
      .getCollateralInfo("ethereum", vault.collateral)
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
