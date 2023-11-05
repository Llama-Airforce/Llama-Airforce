<template>
  <DataTable
    class="datatable-troves"
    columns-header="auto 1fr 12rem minmax(auto, 25rem)"
    columns-data="troves-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
    :sorting="true"
    :sorting-columns="columnsSorting"
    :sorting-columns-enabled="columnsSortingEnabled"
    sorting-default-column="updated"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>

      <TabView
        class="types"
        @tab="onType($event.index)"
      >
        <TabItem header="Open"></TabItem>
        <TabItem header="Closed"></TabItem>
      </TabView>

      <SelectCollateral
        class="select-collateral"
        :collateral="collateral"
        :all="true"
        @select-collateral="collateral = $event"
      ></SelectCollateral>

      <InputText
        v-model="search"
        class="search"
        :search="true"
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="rows.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Row }">
      <img :src="icon(props.item.vault.name)" />

      <div @click.stop>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.owner}`"
          target="_blank"
        >
          {{ addressShort(props.item.owner) }}
        </a>
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        ${{ Math.round(props.item.debt) }}
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        ${{ Math.round(props.item.collateral_usd) }}
      </div>

      <div
        class="number"
        :class="{ hide: type === 'Closed' }"
      >
        <AsyncValue
          :value="props.item.collateral_ratio * 100"
          :precision="2"
          type="percentage"
        />
      </div>

      <div class="number">
        {{ relativeTime(props.item.created_at) }}
      </div>

      <div class="number">
        {{ relativeTime(props.item.last_update) }}
      </div>
    </template>
    <!-- Empty for expander arrow and pointer on hover -->
    <template #row-details> &nbsp; </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  AsyncValue,
  DataTable,
  InputText,
  Pagination,
  TabView,
  TabItem,
  useData,
  SortOrder,
  useRelativeTime,
  useSort,
  usePagination,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import { type Collateral, icon, fromAddress } from "@PM/Models/Collateral";
import PrismaService, {
  type Trove,
  type TroveStatus,
} from "@PM/Services/TroveService";
import SelectCollateral from "@PM/Components/SelectCollateral.vue";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

type Row = Trove & { vault: { name: Collateral; address: string } };

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

// Props
interface Props {
  vaults: TroveManagerDetails[];
  user?: string;
}
const { vaults = [], user } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  troves: [troves: Row[]];
}>();

// Data
const { loading, data, loadData } = useData(async () => {
  if (vaults.length > 0 && user) {
    // For all vaults, get troves and add vault info to trove.
    const troves = await Promise.all(
      vaults.map((vault) =>
        prismaService.getTroves("ethereum", vault.address, user).then((rs) =>
          rs.map((r) => ({
            ...r,
            vault: { name: vault.name, address: vault.address },
          }))
        )
      )
    ).then((rs) => rs.flat());

    emit("troves", troves);

    return troves;
  } else {
    return Promise.resolve([]);
  }
}, []);

// Refs
const { relativeTime } = useRelativeTime();

type SortColumns = "owner" | "debt" | "coll" | "ratio" | "created" | "updated";
const { sortColumn, sortOrder, onSort } = useSort<SortColumns>("updated");

const search = ref("");
const collateral = ref<Collateral | "all">("all");
const type = ref<TroveStatus>("Open");

const columns = computed((): string[] => {
  if (type.value === "Open") {
    return [
      "",
      "Owner",
      "Debt",
      "Collateral",
      "Ratio",
      "Created At",
      "Last Updated",
    ];
  } else {
    return ["", "Owner", "", "", "", "Created At", "Last Updated"];
  }
});

const columnsSorting = computed((): string[] => {
  if (type.value === "Open") {
    return ["", "owner", "debt", "coll", "ratio", "created", "updated"];
  } else {
    return ["", "owner", "", "", "", "created", "updated"];
  }
});

const columnsSortingEnabled = computed((): string[] => {
  if (type.value === "Open") {
    return ["owner", "debt", "coll", "ratio", "created", "updated"];
  } else {
    return ["owner", "created", "updated"];
  }
});

const rows = computed((): Row[] =>
  chain(data.value)
    .filter((row) => type.value === row.status)
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const row_collateral = fromAddress(row.vault.address);

      const isCollateralFilter =
        collateral.value === "all" ? true : collateral.value === row_collateral;

      return includesTerm(row.owner) && isCollateralFilter;
    })
    .orderBy(
      (row) => {
        switch (sortColumn.value) {
          case "owner":
            return row.owner;
          case "debt":
            return row.debt;
          case "coll":
            return row.collateral_usd;
          case "ratio":
            return row.collateral_ratio;
          case "created":
            return row.created_at;
          case "updated":
            return row.last_update;
          default:
            return row.last_update;
        }
      },
      sortOrder.value === SortOrder.Descending ? "desc" : "asc"
    )
    .value()
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

// Events
const onType = (tabIndex: number) => {
  if (tabIndex === 0) {
    type.value = "Open";
  } else if (tabIndex === 1) {
    type.value = "Closed";
  } else {
    type.value = "Open";
  }
};

// Watches
watch(() => vaults, loadData);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-troves {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  ::v-deep(.types) {
    margin: 0 1rem;
    font-size: 0.875rem;

    ul {
      width: auto;
      border-bottom: 0;
    }

    .tab-header {
      padding: 0.5rem 1rem;
    }
  }

  .search {
    margin-right: 2rem;
    font-size: 0.875rem;
    width: auto;
  }

  .select-collateral {
    margin-right: 2rem;
  }

  ::v-deep(.troves-columns-data) {
    --col-width: 11ch;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    display: grid;
    grid-template-columns:
      20px minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
      minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;

    .hide {
      visibility: hidden;
    }

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 1100px) {
        grid-template-columns:
          20px minmax(12ch, 0.5fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 1000px) {
        grid-template-columns:
          20px minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) minmax(12ch, 1fr) 1rem;
      }

      @container (max-width: 900px) {
        grid-template-columns:
          20px minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          minmax(12ch, 1fr) 1rem;

        div:nth-child(7) {
          display: none;
        }
      }

      @container (max-width: 600px) {
        grid-template-columns:
          20px minmax(12ch, 1fr) repeat(3, minmax(var(--col-width), 0.75fr))
          1rem;

        div:nth-child(6) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
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
title: Troves
search-placeholder: Search for...
</i18n>
