<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import { useQueryUserMarkets } from "@CM/Services/llamalend/queries";

const { user } = defineProps<{ user: string | undefined }>();

// Chain
const chain = useRouteQuery<Chain>("chain", "ethereum");
const chains: Chain[] = ["ethereum", "arbitrum"];

const { isFetching: loading, data } = useQueryUserMarkets(
  toRef(() => user),
  chain
);

const columns = [
  "",
  "",
  { id: "market", label: "Market Name", sort: true } as const,
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

// Selection
const selected = useRouteQuery<string | undefined>("controller", undefined);
const values = computed(() => rows.value.map((x) => x.controller));
</script>

<template>
  <Card
    title="Markets"
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
      v-if="rows.length > 0"
      :rows
      :columns
      :sorting
      :selected-row="rows.find((x) => x.controller === selected)"
      @sort-column="onSort"
      @select="selected = $event.controller"
    >
      <template #row="{ item }">
        <div class="center">
          <RadioButton
            v-model="selected"
            name="redemption"
            :values
            :value="item.controller"
          />
        </div>

        <TokenIcon
          chain="ethereum"
          :address="item.controller"
        />

        <div>
          {{ item.name }}
        </div>

        <div class="end">
          {{ new Date(item.snapshotLast * 1000).toLocaleDateString() }}
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(
        user
      )} has not participated in lending markets for ${chain}`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 1rem 26px minmax(7rem, 1fr) minmax(7rem, 1fr);
}

.chain {
  min-width: 10rem;
}
</style>
