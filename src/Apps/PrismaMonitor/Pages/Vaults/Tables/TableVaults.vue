<template>
  <DataTable
    class="datatable-vaults"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="vaults-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="['Name', 'TVL', 'Debt', 'CR', 'MCR', 'Troves', 'Price']"
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

      <div class="number">
        <AsyncValue
          :value="props.item.tvl"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.debt"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.cr * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.mcr * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">{{ props.item.open_troves }}</div>

      <div class="number">${{ Math.round(props.item.price) }}</div>
    </template>

    <template #row-aggregation>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.tvl, 0)"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.debt, 0)"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div></div>
      <div></div>

      <div class="number">
        <AsyncValue
          :value="rows.reduce((acc, x) => acc + x.open_troves, 0)"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div></div>
    </template>

    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, DataTable, InputText } from "@/Framework";
import {
  type TroveManagerDetails,
  TroveOverviewService,
} from "@PM/Services/Socket/TroveOverviewService";
const { t } = useI18n();

const prismaService = new TroveOverviewService("ethereum");

type Row = TroveManagerDetails;

// Refs
const loading = ref(true);
const search = ref("");

const rowsRaw = ref<Row[]>([]);

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name) || includesTerm(row.address);
    })
    .value()
);

watch(prismaService.currentData, (newData) => {
  loading.value = true;

  rowsRaw.value = newData;

  loading.value = false;
});

// Hooks
onMounted(() => {
  loading.value = true;

  rowsRaw.value = prismaService.currentData.value;

  loading.value = false;
});

// Methods
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-vaults {
  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  ::v-deep(.vaults-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns:
      minmax(12ch, 1fr) repeat(6, minmax(var(--col-width), 0.75fr))
      1rem;

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1200px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(7, minmax(var(--col-width), 0.75fr))
          1rem;
      }

      @container (max-width: 1100px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(7, minmax(var(--col-width), 0.75fr))
          1rem;

        div:nth-child(7) {
          display: none;
        }
      }

      @container (max-width: 1000px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(6, minmax(var(--col-width), 0.75fr))
          1rem;

        div:nth-child(4) {
          display: none;
        }
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(8, minmax(var(--col-width), 0.75fr))
          2rem;
      }

      @container (max-width: 900px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(7, minmax(var(--col-width), 0.75fr))
          2rem;

        div:nth-child(7) {
          display: none;
        }
      }

      @container (max-width: 800px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(6, minmax(var(--col-width), 0.75fr))
          2rem;

        div:nth-child(4) {
          display: none;
        }
      }

      @container (max-width: 700px) {
        --col-width: 11ch;

        grid-template-columns:
          minmax(12ch, 1fr) repeat(5, minmax(var(--col-width), 0.75fr))
          2rem;
      }

      @container (max-width: 600px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(4, minmax(var(--col-width), 0.75fr))
          2rem;
      }

      @container (max-width: 500px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(3, var(--col-width))
          2rem;

        div:nth-child(5) {
          display: none;
        }
      }

      @container (max-width: 400px) {
        --col-width: 9ch;
      }

      @container (max-width: 350px) {
        --col-width: 8ch;
      }

      @container (max-width: 325px) {
        grid-template-columns:
          minmax(12ch, 1fr) repeat(2, var(--col-width))
          2rem;

        div:nth-child(3) {
          display: none;
        }
      }

      @container (max-width: 275px) {
        grid-template-columns: minmax(12ch, 1fr) 2rem;

        div:nth-child(3),
        div:nth-child(4) {
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
    div:nth-child(7) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Vaults

search-placeholder: Search for...
</i18n>
