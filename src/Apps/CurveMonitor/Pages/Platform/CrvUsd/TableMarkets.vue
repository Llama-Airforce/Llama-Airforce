<template>
  <DataTable
    class="datatable-trades"
    columns-header="1fr"
    columns-data="trades-columns-data"
    :rows="trades"
    :columns="['Tx', 'Name', 'Value']"
  >
    <template #header-title>
      <div>Largest Trades</div>
    </template>

    <template #row="props: { item: Trade }">
      <div @click.stop>
        <a
          class="vote-link"
          :href="`https://etherscan.io/tx/${props.item.tx}`"
          target="_blank"
        >
          {{ addressShort(props.item.tx) }}
        </a>
      </div>

      <div>{{ props.item.name }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.value"
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
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import type { Chain } from "@CM/Models/Chain";
import CurveService from "@CM/Pages/Home/Services/CurveService";

type Trade = {
  pool: string;
  chain: Chain;
  name: string;
  tx: string;
  value: number;
};

const curveService = new CurveService(getHost());

// Refs
const loading = ref(true);
const trades = ref<Trade[]>([]);

// Hooks
onMounted(async () => {
  loading.value = true;

  trades.value = await curveService
    .getTradesLarge()
    .then((x) => x.large_trades.sort((a, b) => b.value - a.value))
    .then((x) => x.slice(0, 10));

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trades {
  ::v-deep(.trades-columns-data) {
    display: grid;
    grid-template-columns: 6rem 1fr auto;

    div:nth-child(1) {
      font-family: monospace;
    }

    // Right adjust number columns.
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>
