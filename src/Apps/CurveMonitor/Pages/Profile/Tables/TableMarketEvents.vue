<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import { useQueryUserMarketCollateralEvents as useQueryEventsCrvUsd } from "@CM/Services/crvusd/queries";
import { useQueryUserMarketCollateralEvents as useQueryEventsLending } from "@CM/Services/llamalend/queries";

const {
  type,
  user,
  chain = "ethereum",
  controller,
} = defineProps<{
  type: "lending" | "crvusd";
  user: string | undefined;
  chain: Chain | undefined;
  controller: string | undefined;
}>();

const { isFetching: loading, data } =
  type === "lending"
    ? useQueryEventsLending(
        toRef(() => user),
        toRef(() => chain),
        toRef(() => controller)
      )
    : useQueryEventsCrvUsd(
        toRef(() => user),
        toRef(() => chain),
        toRef(() => controller)
      );

const columns = [
  { id: "type", label: "Type", sort: false } as const,
  { id: "loan", label: "Loan", sort: false, align: "end" } as const,
  { id: "collateral", label: "Collateral", sort: false, align: "end" } as const,
  { id: "oracle", label: "Oracle Price", sort: false, align: "end" } as const,
  { id: "timestamp", label: "Time", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  (data.value?.events ?? [])
    .orderBy((x) => x.timestamp, sorting.value.order)
    .take(100)
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
    title="Position Events"
    :loading
  >
    <Table
      v-if="rows.length > 0"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item }">
        <div>{{ item.type }}</div>

        <div class="end">
          <AsyncValue
            v-if="item.loanChangeUsd"
            type="dollar"
            :value="item.loanChangeUsd"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="item.collateralChangeUsd"
            type="dollar"
            :value="item.collateralChangeUsd"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.oraclePrice"
            :precision="2"
          />
        </div>

        <div class="end">
          <a
            class="font-mono"
            target="_blank"
            :href="`https://${scanUrl(chain)}/tx/${item.txHash}`"
            @click.stop
          >
            {{ new Date(item.timestamp * 1000).toLocaleDateString() }}
          </a>
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(
        user
      )} had no market events for market ${addressShort(controller)}`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(5rem, 1fr) minmax(5rem, 1fr) minmax(5rem, 1fr)
    minmax(5rem, 1fr) minmax(5rem, 1fr);
}
</style>
