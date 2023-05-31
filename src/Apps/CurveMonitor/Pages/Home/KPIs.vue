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
      :has-value="true"
      value="$69b"
    >
    </KPI>

    <KPI
      label="7-day Volume"
      :has-value="true"
      value="$42b"
    >
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AsyncValue, KPI } from "@/Framework";
import { getHost } from "@/Services/Host";
import DefiLlamaService from "@CM/Pages/Home/Services/DefiLlamaService";

const llamaService = new DefiLlamaService(getHost());

// Refs
const price = ref<number | null>(null);
const mcap = ref<number | null>(null);

// Hooks
onMounted(async () => {
  const data = await llamaService.getData();
  price.value = data.price;
  mcap.value = data.mcap;
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
