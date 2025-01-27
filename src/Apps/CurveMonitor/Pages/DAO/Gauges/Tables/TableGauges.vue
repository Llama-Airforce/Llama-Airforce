<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import { useQueryGauges } from "@CM/queries/gauge";

const { isFetching: loading, data: gauges } = useQueryGauges();

const columns = [
  { id: "name", label: "Name / Address", sort: false } as const,
  {
    id: "destination",
    label: "Destination",
    sort: false,
  } as const,
  {
    id: "lp",
    label: "LP Token",
    sort: false,
  } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "creation", label: "Creation", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("weight");

const search = ref("");

const rows = computed(() =>
  gauges.value
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(
        `${row.address} ${row.pool?.name ?? ""} ${row.pool?.address ?? ""} ${
          row.market?.name ?? ""
        } ${row.lpToken ?? ""}`
      );
    })
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "weight":
          return Number(x.weight);
        case "creation":
          return x.creationDate.getTime();
      }
    }, sorting.value.order)
);

const rowsPerPage = 15;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

function clean(name: string): string {
  return name.replace("Curve.fi", "").replace("Gauge Deposit", "").trim();
}

function scanUrl(chain: Chain) {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (chain) {
    case "arbitrum":
      return "arbiscan.io";
    case "ethereum":
      return "etherscan.io";
    default:
      return "etherscan.io";
  }
}

const router = useRouter();

const onSelect = async (newGauge: (typeof gauges.value)[number]) => {
  await router.push({
    name: "gauge",
    params: {
      tab: "",
      gaugeAddr: newGauge.address,
    },
  });
};
</script>

<template>
  <Card
    title="Gauges"
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
      @select="onSelect"
    >
      <template #row="{ item }">
        <div
          style="display: contents"
          :class="{ killed: item.killed }"
        >
          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/address/${item.address}`"
              @click.stop
            >
              {{ clean(item.name ?? item.address) }}
            </a>
          </div>

          <div>
            <a
              v-if="!!item.pool"
              class="font-mono"
              target="_blank"
              :href="`https://${scanUrl(item.pool.chain)}/address/${
                item.pool.address
              }`"
              @click.stop
            >
              {{ clean(item.pool.name) }}
            </a>

            <span v-else-if="!!item.market">
              {{ clean(item.market.name) }}
            </span>
          </div>

          <div>
            <a
              v-if="!!item.lpToken && !!item.pool"
              class="font-mono"
              target="_blank"
              :href="`https://${scanUrl(item.pool.chain)}/address/${
                item.lpToken
              }`"
              @click.stop
            >
              {{ addressShort(item.lpToken) }}
            </a>
          </div>

          <div class="end">
            <AsyncValue
              v-if="item.weight > 0"
              :value="Number(item.weight) / 10 ** 18"
            />
          </div>

          <div class="end">
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/tx/${item.creationTx}`"
              @click.stop
            >
              {{ item.creationDate.toLocaleDateString() }}
            </a>
          </div>

          <IconExpander />
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
    minmax(7rem, 0.5fr) minmax(7rem, 0.5fr) 1rem;

  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .killed > * {
    opacity: 0.5;
  }
}
</style>
