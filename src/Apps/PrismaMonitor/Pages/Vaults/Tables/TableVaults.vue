<template>
  <DataTable
    class="datatable-vaults"
    :loading="loading"
    :rows="rows"
    :columns="['', 'Name', 'TVL', 'Debt', 'CR', 'MCR', 'Troves', 'Price']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template #row="props: { item: Row }">
      <img :src="icon(props.item.address)" />
      <div :class="{ deprecated: isDeprecated(props.item.address) }">
        {{ label(props.item.address) ?? props.item.name }}
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        <AsyncValue
          :value="props.item.tvl"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        <AsyncValue
          :value="props.item.debt"
          :precision="0"
          :show-symbol="false"
          type="dollar"
        />
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        <AsyncValue
          :value="props.item.cr * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        <AsyncValue
          :value="props.item.mcr * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        {{ props.item.open_troves }}
      </div>

      <div
        class="number"
        :class="{ deprecated: isDeprecated(props.item.address) }"
      >
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.price)"
          :precision="Infinity"
        ></AsyncValue>
      </div>
    </template>

    <template #row-aggregation>
      <div></div>
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
import { chain } from "lodash";
import { icon, label, isDeprecated } from "@PM/Models/Vault";
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { type TroveManagerDetails, TroveOverviewService } from "@PM/Services";

const { t } = useI18n();

type Row = TroveManagerDetails;

// Stores
const storeSettings = useSettingsStore();

// Services
const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");

// Refs
const search = ref("");

const rowsRaw = useObservable(prismaService.overview$, []);

const rows = computed((): Row[] =>
  chain(rowsRaw.value)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name) || includesTerm(row.address);
    })
    .orderBy((row) => row.debt, "desc")
    .value()
);

const loading = computed(() => rowsRaw.value.length === 0);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-vaults {
  --columns-header: minmax(7rem, 1fr) minmax(auto, 25rem);

  --col-width: 11ch;
  --columns-data: 20px minmax(12ch, 1fr)
    repeat(6, minmax(var(--col-width), 0.75fr)) 1rem;

  container-type: inline-size;

  .search {
    font-size: 0.875rem;
    margin-left: 1rem;
  }

  .deprecated {
    opacity: 0.5;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }

  :deep(.row-data) {
    // Mobile
    @media only screen and (max-width: 1280px) {
      @container (max-width: 800px) {
        --columns-data: 20px minmax(12ch, 1fr)
          repeat(5, minmax(var(--col-width), 0.75fr)) 1rem;

        div:nth-child(8) {
          display: none;
        }
      }

      @container (max-width: 650px) {
        --columns-data: 20px minmax(12ch, 1fr)
          repeat(4, minmax(var(--col-width), 0.75fr)) 1rem;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 550px) {
        --col-width: 10ch;

        --columns-data: 20px minmax(12ch, 1fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) 1rem;

        div:nth-child(7) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5),
    div:nth-child(6),
    div:nth-child(7),
    div:nth-child(8) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Vaults

search-placeholder: Search for...
</i18n>
