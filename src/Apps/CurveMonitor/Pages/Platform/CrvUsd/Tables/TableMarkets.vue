<template>
  <DataTable
    class="datatable-markets"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="markets-columns-data"
    :rows="rows"
    :columns="[
      'Name',
      '# Loans',
      'Rate',
      'Borrowed',
      'Collateral ($)',
      'Fees (P / C)',
    ]"
    :loading="loading"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template #row="props: { item: Row }">
      <div>{{ props.item.name }}</div>
      <div class="number">{{ props.item.loans }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.rate * 100"
          :precision="2"
          type="percentage"
        />

        <span
          class="delta"
          :class="{ negative: props.item.rateAbsDelta < 0 }"
        >
          (<AsyncValue
            :value="props.item.rateAbsDelta * 100"
            :precision="2"
            :show-unit="false"
            type="percentage"
          />)
        </span>
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.borrowed"
          :precision="2"
          :show-symbol="false"
          type="dollar"
        />

        <span
          class="delta"
          :class="{ negative: props.item.borrowedDelta < 0 }"
        >
          (<AsyncValue
            :value="props.item.borrowedDelta * 100"
            :precision="2"
            type="percentage"
          />)
        </span>
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalCollateral"
          :precision="2"
          type="dollar"
        />

        <span
          class="delta"
          :class="{ negative: props.item.totalCollateralDelta < 0 }"
        >
          (<AsyncValue
            :value="props.item.totalCollateralDelta * 100"
            :precision="2"
            type="percentage"
          />)
        </span>
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.fees.pending?.adminBorrowingFees"
          :precision="2"
          type="dollar"
        />

        /

        <AsyncValue
          :value="props.item.fees.collected?.adminBorrowingFees ?? 0"
          :precision="0"
          :show-zero="true"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
      <div class="number">{{ rows.reduce((acc, x) => acc + x.loans, 0) }}</div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.borrowed, 0)"
          :precision="2"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalCollateral, 0)"
          :precision="2"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="aggrFeesPending"
          :precision="2"
          type="dollar"
        />

        /

        <AsyncValue
          :value="aggrFeesCollected"
          :precision="0"
          :show-zero="true"
          type="dollar"
        />
      </div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText } from "@/Framework";
import { getHost } from "@/Services/Host";
import CurveService, {
  type Market,
  type FeesBreakdown,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

type Row = Market & {
  fees: {
    pending: FeesBreakdown | undefined;
    collected: FeesBreakdown | undefined;
  };
};

// Refs
const loading = ref(true);
const rowsRaw = ref<Row[]>([]);
const search = ref("");

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name) || includesTerm(row.address);
    })
    .value()
);

const aggrFeesPending = computed((): number =>
  rows.value.reduce(
    (acc, x) => acc + (x.fees.pending?.adminBorrowingFees ?? 0),
    0
  )
);

const aggrFeesCollected = computed((): number =>
  rows.value.reduce(
    (acc, x) => acc + (x.fees.collected?.adminBorrowingFees ?? 0),
    0
  )
);

// Hooks
onMounted(async () => {
  loading.value = true;

  const { markets } = await curveService.getMarkets();
  const fees = await curveService.getFeesBreakdown();

  rowsRaw.value = markets
    .map((market) => ({
      ...market,
      fees: {
        pending: fees.pending.find((x) => x.market === market.address),
        collected: fees.collected.find((x) => x.market === market.address),
      },
    }))
    .sort((a, b) => b.totalCollateral - a.totalCollateral);

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.markets-columns-data) {
    display: grid;
    grid-template-columns: 1fr 4rem 7rem 8rem 8rem 6rem 1rem;

    @media only screen and (max-width: 1280px) {
      grid-template-columns: 1fr 3rem 4rem 5rem 1rem;

      div:nth-child(2),
      div:nth-child(6) {
        display: none;
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6) {
      justify-content: end;
    }

    .delta {
      font-size: 0.75rem;
      color: var(--c-green);

      @media only screen and (max-width: 1280px) {
        display: none;
      }

      &.negative {
        color: var(--c-red);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Markets (24h)

search-placeholder: Search for...
</i18n>
