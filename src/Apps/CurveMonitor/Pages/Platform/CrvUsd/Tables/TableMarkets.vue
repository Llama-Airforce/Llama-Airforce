<template>
  <DataTable
    class="datatable-markets"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="markets-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="[
      'Name',
      'Loans',
      'Rate',
      'Change (24h)',
      'Borrowed',
      'Change (24h)',
      'Collateral',
      'Fees Pending',
      'Fees Collected',
    ]"
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
      </div>

      <div
        class="number delta"
        :class="{ negative: props.item.rateAbsDelta < 0 }"
      >
        {{ props.item.rateAbsDelta > 0 ? "+" : "" }}
        <AsyncValue
          v-if="props.item.rateAbsDelta"
          :value="props.item.rateAbsDelta * 100"
          :precision="2"
          :show-unit="false"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.borrowed"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div
        class="number delta"
        :class="{ negative: props.item.borrowedDelta < 0 }"
      >
        {{ props.item.borrowedDelta > 0 ? "+" : "" }}
        <AsyncValue
          v-if="props.item.borrowedDelta"
          :value="props.item.borrowedDelta * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalCollateral"
          :precision="0"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="totalFees(props.item.fees.pending)"
          :precision="0"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="totalFees(props.item.fees.collected)"
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
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.borrowed, 0)"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalCollateral, 0)"
          :precision="0"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + totalFees(x.fees.pending), 0)"
          :precision="0"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + totalFees(x.fees.collected), 0)"
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
    pending?: FeesBreakdown;
    collected?: FeesBreakdown;
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

// Methods
const totalFees = (fees?: FeesBreakdown): number =>
  fees
    ? fees.adminBorrowingFees +
      fees.collateralAdminFeesUsd +
      fees.crvUsdAdminFees
    : 0;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-markets {
  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.markets-columns-data) {
    --col-width: 12ch;

    display: grid;
    grid-template-columns: 1fr repeat(8, var(--col-width)) 1rem;

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1200px) {
        grid-template-columns: 1fr repeat(7, var(--col-width)) 1rem;

        div:nth-child(2) {
          display: none;
        }
      }

      @container (max-width: 1100px) {
        grid-template-columns: 1fr repeat(6, var(--col-width)) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 1000px) {
        grid-template-columns: 1fr repeat(5, var(--col-width)) 1rem;

        div:nth-child(4) {
          display: none;
        }
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        grid-template-columns: 1fr repeat(7, var(--col-width)) 1rem;

        div:nth-child(2) {
          display: none;
        }
      }

      @container (max-width: 900px) {
        grid-template-columns: 1fr repeat(6, var(--col-width)) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 800px) {
        grid-template-columns: 1fr repeat(5, var(--col-width)) 1rem;

        div:nth-child(4) {
          display: none;
        }
      }

      @container (max-width: 700px) {
        --col-width: 11ch;
      }

      @container (max-width: 600px) {
        grid-template-columns: 1fr repeat(4, var(--col-width)) 1rem;

        div:nth-child(8) {
          display: none;
        }
      }

      @container (max-width: 500px) {
        grid-template-columns: 1fr repeat(3, var(--col-width)) 1rem;

        div:nth-child(9) {
          display: none;
        }
      }

      @container (max-width: 400px) {
        --col-width: 10ch;
      }

      @container (max-width: 350px) {
        --col-width: 9ch;
      }

      @container (max-width: 325px) {
        --col-width: 8ch;
      }

      @container (max-width: 300px) {
        grid-template-columns: 1fr repeat(2, var(--col-width)) 1rem;

        div:nth-child(7) {
          display: none;
        }
      }

      @container (max-width: 250px) {
        grid-template-columns: 1fr 1rem;

        div:nth-child(3),
        div:nth-child(5) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6),
    div:nth-child(7),
    div:nth-child(8),
    div:nth-child(9) {
      justify-content: end;
    }

    .delta {
      color: var(--c-green);

      &.negative {
        color: var(--c-red);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Markets

search-placeholder: Search for...
</i18n>
