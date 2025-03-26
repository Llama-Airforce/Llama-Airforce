<script setup lang="ts">
import { useQueryPrice } from "@/Services/PriceQuery";

const { data: rsupPrice } = useQueryPrice(toRef(() => RsupAddress));
const { data: reusdPrice } = useQueryPrice(toRef(() => ReUsdAddress));
</script>

<template>
  <div class="kpis">
    <KPI
      class="border-special"
      label="RSUP Price"
      :has-value="!!rsupPrice"
    >
      <AsyncValue
        type="dollar"
        :value="rsupPrice?.price ?? Infinity"
        :precision="3"
      />
    </KPI>

    <KPI
      class="border-special"
      label="reUSD Price"
      :has-value="!!reusdPrice"
    >
      <AsyncValue
        type="dollar"
        :value="reusdPrice?.price ?? Infinity"
        :precision="3"
      />
    </KPI>
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: calc(1.25 * var(--dashboard-gap));

  &:deep(> .kpi) {
    .label {
      font-size: 0.9rem;
    }
  }

  .kpi {
    box-shadow: none;

    --border-special-time: 10s;
  }
}
</style>
