<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import { useQueryUserMarkets } from "@CM/queries/llamalend";

const { user } = defineProps<{ user: string | undefined }>();

// Chain
const chain = useRouteQuery<Chain>("chain", "ethereum");
const chains: Chain[] = ["ethereum", "arbitrum"];

const { isFetching: loading, data } = useQueryUserMarkets(
  toRef(() => user),
  chain
);

const columns = [
  { id: "market", label: "Market", sort: true } as const,
  {
    id: "last_update",
    label: "Last Updated",
    sort: true,
    align: "end",
  } as const,
];

const { sorting, onSort } = useSort<typeof columns>("last_update");

const rows = computed(() =>
  data.value.orderBy((x) => {
    switch (sorting.value.column) {
      case "market":
        return x.name;
      case "last_update":
        return Number(x.snapshotLast);
    }
  }, sorting.value.order)
);

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
</script>

<template>
  <Card
    title="Locks"
    :loading
  >
    <template #actions>
      <SelectChain
        class="chain"
        :chain
        :chains
        @select-chain="chain = $event === 'all' ? 'ethereum' : $event"
      />
    </template>

    <Table
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://${scanUrl(chain)}/address/${item.controller}`"
          >
            {{ item.name }}
          </a>
        </div>

        <div class="end">
          {{ item.snapshotLast.toLocaleDateString() }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(7rem, 1fr) minmax(7rem, 1fr);
}

.chain {
  min-width: 10rem;
}
</style>
