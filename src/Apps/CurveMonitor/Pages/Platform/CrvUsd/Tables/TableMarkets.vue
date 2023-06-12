<template>
  <DataTable
    class="datatable-markets"
    columns-header="1fr"
    columns-data="markets-columns-data"
    :rows="markets"
    :columns="[
      'Name',
      '# Loans',
      'Borrow Rate',
      'Total Borrowed',
      'Total Collateral ($)',
    ]"
  >
    <template #header-title>
      <div>Markets</div>
    </template>

    <template #row="props: { item: Market }">
      <div>{{ props.item.name }}</div>
      <div class="number">{{ props.item.loans }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.rate * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.borrowed"
          :precision="2"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.collateral"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AsyncValue, DataTable } from "@/Framework";
import { getHost } from "@/Services/Host";
import CurveService, {
  type Market,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const curveService = new CurveService(getHost());

// Refs
const loading = ref(true);
const markets = ref<Market[]>([]);

// Hooks
onMounted(async () => {
  loading.value = true;

  markets.value = await curveService
    .getMarkets()
    .then((x) =>
      x.markets.sort((a, b) => b.totalCollateral - a.totalCollateral)
    );

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  ::v-deep(.markets-columns-data) {
    display: grid;
    grid-template-columns: 1fr 5rem 6rem 7rem 8rem 1rem;

    @media only screen and (max-width: 1280px) {
      grid-template-columns: 1fr 2rem 3rem 4rem 4rem 1rem;
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>
