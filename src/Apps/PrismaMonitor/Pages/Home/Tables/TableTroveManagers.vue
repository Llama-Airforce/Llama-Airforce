<template>
  <DataTable
    class="datatable-trovemanagers"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="trovemanagers-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="[
      'Name',
      'Collateral Price',
      'Total Debt (mkUSD)',
      'Total Collateral',
      'Total Collateral ($)',
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

      <div class="number">${{ Math.round(props.item.collateralPrice) }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalDebt"
          :precision="1"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalCollateral"
          :precision="1"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.totalCollateralUSD"
          :precision="1"
          type="dollar"
        />
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalDebt, 0)"
          :precision="1"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.totalCollateralUSD, 0)"
          :precision="1"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText } from "@/Framework";
import { getHost } from "@/Services/Host";
import TroveService, {
  type TroveManager,
} from "@PM/Pages/Home/Services/TroveService";

const { t } = useI18n();

const troveService = new TroveService(getHost());

type Row = TroveManager;

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

      return includesTerm(row.name);
    })
    .value()
);

// Hooks
onMounted(async () => {
  loading.value = true;

  const troveManagers = await troveService.getTroveManagers();

  rowsRaw.value = troveManagers.sort((a, b) => b.totalDebt - a.totalDebt);

  loading.value = false;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trovemanagers {
  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.trovemanagers-columns-data) {
    --col-width: 16ch;

    display: grid;
    grid-template-columns: 1fr repeat(4, var(--col-width));

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 750px) {
        --col-width: 15ch;
      }

      @container (max-width: 650px) {
        --col-width: 14ch;
      }

      @container (max-width: 600px) {
        --col-width: 13ch;
      }

      @container (max-width: 575px) {
        --col-width: 12ch;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      @container (max-width: 575px) {
        --col-width: 15ch;
      }

      @container (max-width: 525px) {
        --col-width: 14ch;
      }

      @container (max-width: 500px) {
        --col-width: 13ch;
      }

      @container (max-width: 475px) {
        --col-width: 12ch;
      }

      @container (max-width: 450px) {
        --col-width: 11ch;
      }

      @container (max-width: 425px) {
        --col-width: 10ch;
      }

      @container (max-width: 375px) {
        grid-template-columns: 1fr repeat(3, var(--col-width));

        div:nth-child(2) {
          display: none;
        }
      }

      @container (max-width: 325px) {
        grid-template-columns: 1fr repeat(2, var(--col-width));

        div:nth-child(4) {
          display: none;
        }
      }

      @container (max-width: 250px) {
        grid-template-columns: 1fr;

        div:nth-child(5) {
          display: none;
        }
      }
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

<i18n lang="yaml" locale="en">
title: Trove Managers

search-placeholder: Search for...
</i18n>
