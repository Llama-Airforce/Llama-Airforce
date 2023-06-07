<template>
  <div class="kpis">
    <KPI
      label="CRV price"
      :has-value="!!price"
    >
      <AsyncValue
        :value="price"
        :precision="2"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="CRV market cap"
      :has-value="!!mcap"
    >
      <AsyncValue
        :value="mcap"
        :precision="2"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="Total Value Locked"
      :has-value="!!tvl"
    >
      <AsyncValue
        :value="tvl"
        :precision="1"
        type="dollar"
      ></AsyncValue>
    </KPI>

    <KPI
      label="7-day Volume"
      :has-value="!!volume"
    >
      <AsyncValue
        :value="volume"
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
import DefiLlamaService from "@CM/Pages/Home/Services/DefiLlamaService";
import CurveService from "@CM/Pages/Home/Services/CurveService";

const llamaService = new DefiLlamaService(getHost());
const curveService = new CurveService(getHost());

// Refs
const price = ref<number | null>(null);
const mcap = ref<number | null>(null);
const tvl = ref<number | null>(null);
const volume = ref<number | null>(null);

// Hooks
onMounted(async () => {
  const llama_ = llamaService.getData();
  const curveTvl_ = curveService.getTvlBreakdownType();
  const curveVol_ = curveService.getVolumeBreakdownType();

  // CRV Price + MCap
  try {
    const llama = await llama_;
    [price.value, mcap.value] = [llama.tokenPrice, llama.mcap];
  } catch {
    [price.value, mcap.value] = [0, 0];
  }

  // TVL
  try {
    tvl.value = await curveTvl_.then((resp) =>
      resp.tvl_breakdown_type.reduce((acc, x) => acc + x.tvl, 0)
    );
  } catch {
    tvl.value = 0;
  }

  // Volume
  try {
    volume.value = await curveVol_.then((resp) =>
      resp.volume_breakdown_type.reduce((acc, x) => acc + x.volumeUSD, 0)
    );
  } catch {
    volume.value = 0;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpis {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
}
</style>
