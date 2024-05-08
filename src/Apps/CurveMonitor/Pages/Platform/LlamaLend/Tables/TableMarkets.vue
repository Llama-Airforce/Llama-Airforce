<template>
  <DataTable
    class="datatable-markets"
    columns-header="1fr"
    columns-data="markets-columns-data"
    expand-side="left"
    :loading="loading"
    :rows="markets"
    :columns="['', 'Name', 'Borrow Rate', 'Lend Rate', 'Loans']"
  >
    <template #header-content>
      <div class="title">{{ title }}</div>
    </template>

    <template #row="{ item: market }: { item: Row }">
      <template v-if="market">
        <div>{{ market.name }}</div>
        <div class="number">
          <AsyncValue
            :value="market.borrow_apy"
            :precision="2"
            type="percentage"
          />
        </div>

        <div class="number">
          <AsyncValue
            :value="market.lend_apy"
            :precision="2"
            type="percentage"
          />
        </div>

        <div class="number">{{ market.n_loans }}</div>

        <!--
        <div class="number">
        <AsyncValue
          :value="tvl(props.item)"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
        </div> -->
      </template>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="number">
        {{
          markets
            .filter((market) => market)
            .map((market) => market!)
            .reduce((acc, x) => acc + x.n_loans, 0)
        }}
      </div>
      <!--       <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + tvl(x), 0)"
          :precision="decimals"
          :show-symbol="false"
          type="dollar"
        />
      </div> -->
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models";

type Row = Market;

// Props
interface Props {
  markets: (Market | undefined)[];
  loading: boolean;
  title: string;
}

const { markets = [], loading, title } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  container-type: inline-size;

  ::v-deep(.markets-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      1rem
      minmax(12ch, 1fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr);

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>
