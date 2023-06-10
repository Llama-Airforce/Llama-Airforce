<template>
  <DataTable
    class="datatable-pool-stats"
    columns-header="1fr"
    columns-data="pool-stats-columns-data"
    :rows="poolStats"
    :columns="['Name', 'TVL', 'Volume']"
  >
    <template #header-title>
      <div>Pools</div>
    </template>

    <template #row="props: { item: PoolStats }">
      <div>{{ props.item.name }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.volumeUSD"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AsyncValue, DataTable } from "@/Framework";
import { getHost } from "@/Services/Host";
import CurveService, {
  type PoolStats,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const curveService = new CurveService(getHost());

// Refs
const loading = ref(true);
const poolStats = ref<PoolStats[]>([]);

// Hooks
onMounted(async () => {
  loading.value = true;

  poolStats.value = await curveService
    .getPoolStats()
    .then((x) => x.stats.sort((a, b) => b.tvl - a.tvl));

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-pool-stats {
  ::v-deep(.pool-stats-columns-data) {
    display: grid;
    grid-template-columns: 1fr repeat(2, 0.9fr);

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>
