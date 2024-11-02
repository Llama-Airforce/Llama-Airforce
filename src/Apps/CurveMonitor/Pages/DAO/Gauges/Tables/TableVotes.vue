<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useQueryVotes } from "@CM/Services/Gauge/Queries";

const { gaugeAddress } = defineProps<{
  gaugeAddress: string | undefined;
}>();

const { isFetching: loading, data: gauges } = useQueryVotes(
  toRef(() => gaugeAddress)
);

const columns = [
  { id: "voter", label: "Voter", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "block", label: "Block", sort: true, align: "end" } as const,
  { id: "time", label: "Timestamp", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("time");

const search = ref("");

const rows = computed(() =>
  gauges.value
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.user);
    })
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "time":
          return x.timestamp;
        case "weight":
          return x.weight;
        case "block":
          return x.blockNumber;
      }
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<template>
  <Card
    title="Votes"
    :loading
  >
    <template #actions>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem">
        <Pagination
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        />

        <InputText
          v-model="search"
          search
          placeholder="Search for..."
        />
      </div>
    </template>

    <Table
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${item.user}`"
            @click.stop
          >
            {{ addressShort(item.user) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue :value="item.weight" />
        </div>

        <div class="end">
          {{ item.blockNumber }}
        </div>

        <div class="end">
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/tx/${item.tx}`"
            @click.stop
          >
            {{ new Date(item.timestamp * 1000).toLocaleDateString() }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.card {
  --header-column-title: 1fr;

  .search {
    min-width: 20rem;
  }
}

.table {
  --columns-data: minmax(7rem, 1fr) minmax(7rem, 0.75fr) minmax(7rem, 0.5fr)
    minmax(7rem, 0.5fr);

  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
