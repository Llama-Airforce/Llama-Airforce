<script setup lang="ts">
import {
  useRedemptions,
  useAirdropsTeam,
  useAirdropsVictims,
} from "@HA/queries/vesting";

const chain = { chain: "ethereum" };
const { data: redemptions } = useRedemptions(chain);
const { data: airdropsTeam } = useAirdropsTeam(chain);
const { data: airdropsVictims } = useAirdropsVictims(chain);

const selectedTab = ref(0);

const redemptionsColumns = [
  { id: "date", label: "Date", sort: true } as const,
  { id: "value", label: "RSUP", sort: true, align: "end" } as const,
];

const airdropsColumns = [
  { id: "date", label: "Date", sort: true } as const,
  { id: "value", label: "RSUP", sort: true, align: "end" } as const,
];

const { sorting: redemptionsSorting, onSort: onRedemptionsSort } =
  useSort<typeof redemptionsColumns>("date");

const { sorting: airdropsTeamSorting, onSort: onAirdropsTeamSort } =
  useSort<typeof airdropsColumns>("date");

const { sorting: airdropsVictimsSorting, onSort: onAirdropsVictimsSort } =
  useSort<typeof airdropsColumns>("date");

const rowsRedemptions = computed(() =>
  (redemptions.value?.history ?? []).orderBy((item) => {
    switch (redemptionsSorting.value.column) {
      case "date":
        return item.timestamp.getTime();
      case "value":
        return item.value;
      default:
        return 0;
    }
  }, redemptionsSorting.value.order)
);

const rowsAirdropsTeam = computed(() =>
  (airdropsTeam.value?.history ?? []).orderBy((item) => {
    switch (airdropsTeamSorting.value.column) {
      case "date":
        return item.timestamp.getTime();
      case "value":
        return item.value;
      default:
        return 0;
    }
  }, airdropsTeamSorting.value.order)
);

const rowsAirdropsVictims = computed(() =>
  (airdropsVictims.value?.history ?? []).orderBy((item) => {
    switch (airdropsVictimsSorting.value.column) {
      case "date":
        return item.timestamp.getTime();
      case "value":
        return item.value;
      default:
        return 0;
    }
  }, airdropsVictimsSorting.value.order)
);

const rowsPerPage = 10;

const {
  page: redemptionsPage,
  rowsPage: redemptionsRowsPage,
  onPage: onRedemptionsPage,
} = usePagination(rowsRedemptions, rowsPerPage);

const {
  page: airdropsTeamPage,
  rowsPage: airdropsTeamRowsPage,
  onPage: onAirdropsTeamPage,
} = usePagination(rowsAirdropsTeam, rowsPerPage);

const {
  page: airdropsVictimsPage,
  rowsPage: airdropsVictimsRowsPage,
  onPage: onAirdropsVictimsPage,
} = usePagination(rowsAirdropsVictims, rowsPerPage);
</script>

<template>
  <Card>
    <template #title>
      <TabView
        :active="selectedTab"
        @tab="selectedTab = $event.index"
      >
        <TabItem header="Redemptions" />
        <TabItem header="Team Airdrops" />
        <TabItem header="Victims Airdrops" />
      </TabView>
    </template>

    <template #actions>
      <Pagination
        v-if="selectedTab === 0"
        :items-count="rowsRedemptions.length"
        :items-per-page="rowsPerPage"
        :page="redemptionsPage"
        @page="onRedemptionsPage"
      />

      <Pagination
        v-if="selectedTab === 1"
        :items-count="rowsAirdropsTeam.length"
        :items-per-page="rowsPerPage"
        :page="airdropsTeamPage"
        @page="onAirdropsTeamPage"
      />

      <Pagination
        v-if="selectedTab === 2"
        :items-count="rowsAirdropsVictims.length"
        :items-per-page="rowsPerPage"
        :page="airdropsVictimsPage"
        @page="onAirdropsVictimsPage"
      />
    </template>

    <Table
      v-if="selectedTab === 0"
      class="redemptions-table"
      :rows="redemptionsRowsPage"
      :columns="redemptionsColumns"
      :sorting="redemptionsSorting"
      @sort-column="onRedemptionsSort"
    >
      <template #row="{ item }">
        <div>{{ item.timestamp.toLocaleDateString() }}</div>
        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.value"
            :precision="2"
            :show-symbol="false"
          />
        </div>
      </template>
    </Table>

    <Table
      v-if="selectedTab === 1"
      class="airdrops-table"
      :rows="airdropsTeamRowsPage"
      :columns="airdropsColumns"
      :sorting="airdropsTeamSorting"
      @sort-column="onAirdropsTeamSort"
    >
      <template #row="{ item }">
        <div>{{ item.timestamp.toLocaleDateString() }}</div>
        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.value"
            :precision="2"
            :show-symbol="false"
          />
        </div>
      </template>
    </Table>

    <Table
      v-if="selectedTab === 2"
      class="airdrops-table"
      :rows="airdropsVictimsRowsPage"
      :columns="airdropsColumns"
      :sorting="airdropsVictimsSorting"
      @sort-column="onAirdropsVictimsSort"
    >
      <template #row="{ item }">
        <div>{{ item.timestamp.toLocaleDateString() }}</div>
        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.value"
            :precision="2"
            :show-symbol="false"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.tab-view:deep(.tab-header) {
  font-size: 1rem;
}

.redemptions-table {
  --columns-data: minmax(10rem, 1fr) minmax(10ch, 1fr);
}

.airdrops-table {
  --columns-data: minmax(10rem, 1fr) minmax(10ch, 1fr);
}
</style>
