<template>
  <DataTable
    class="datatable-markets"
    columns-header="1fr"
    columns-data="markets-columns-data"
    expand-side="left"
    :loading="loading"
    :rows="markets"
    :columns="['', '', 'Name', 'Borrow Rate', 'Lend Rate', 'TVL', 'Loans']"
  >
    <template #header-content>
      <div class="title">{{ title }}</div>
    </template>

    <template #row="{ item: market }: { item: Row }">
      <template v-if="market">
        <img :src="icon(market)" />

        <div>{{ market.name }}</div>
        <div class="number">
          <AsyncValue
            v-if="market.borrow_apy"
            :value="market.borrow_apy"
            type="percentage"
          />
        </div>

        <div class="number">
          <AsyncValue
            v-if="market.lend_apy"
            :value="market.lend_apy"
            type="percentage"
          />
        </div>

        <div class="number">
          <AsyncValue
            v-if="tvl(market)"
            :value="tvl(market)"
            type="dollar"
          />
        </div>

        <div class="number">{{ market.n_loans }}</div>
      </template>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="number">
        <AsyncValue
          :value="markets.filter(market => market).map(market => market!).reduce((acc, x) => acc + tvl(x), 0)"
          type="dollar"
        />
      </div>
      <div class="number">
        {{
          markets
            .filter((market) => market)
            .map((market) => market!)
            .reduce((acc, x) => acc + x.n_loans, 0)
        }}
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Chain } from "@CM/Models/Chain";
import { type Market, tvl } from "@CM/Pages/Platform/LlamaLend/Models";

type Row = Market;

const { t } = useI18n();

// Props
interface Props {
  markets: (Market | undefined)[];
  loading: boolean;
  type: "long" | "short";
  chain: Chain;
}

const { markets = [], loading, type, chain } = defineProps<Props>();

// Refs
const title = computed(() => t(type === "long" ? "title-long" : "title-short"));

// Methods
const icon = (market: Market) => {
  const tokenAddress = (
    type === "long"
      ? market.collateral_token.address
      : market.borrowed_token.address
  ).toLocaleLowerCase();

  const chainSuffix = chain !== "ethereum" ? `-${chain}` : "";

  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets${chainSuffix}/${tokenAddress}.png`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  container-type: inline-size;

  ::v-deep(.markets-columns-data) {
    --col-width: 10ch;

    display: grid;
    grid-template-columns:
      1rem
      26px
      minmax(12ch, 1fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.75fr)
      minmax(var(--col-width), 0.25fr);

    // Right adjust number columns.
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6),
    div:nth-child(7) {
      justify-content: end;
    }

    img {
      aspect-ratio: 1;
      max-width: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title-long: Markets - Long
title-short: Markets - Short
</i18n>
