<script setup lang="ts">
import { useQueryMarkets, useQueryUserMarkets } from "@CM/queries/crvusd";
import type { Chain } from "@curvefi/prices-api";

const { user } = defineProps<{ user: string | undefined }>();

// Chain
const chain = useRouteQuery<Chain>("chain", "ethereum");
const chains: Chain[] = ["ethereum", "arbitrum"];

const { isFetching: loadingUserMarkets, data: userMarkets } =
  useQueryUserMarkets(
    toRef(() => user),
    chain
  );

const { isFetching: loadingMarkets, data: markets } = useQueryMarkets();

const loading = computed(
  () => loadingUserMarkets.value || loadingMarkets.value
);

const columns = [
  "",
  "",
  { id: "collateral", label: "Collateral", sort: true } as const,
  {
    id: "last_update",
    label: "Last Updated",
    sort: true,
    align: "end",
  } as const,
];

const { sorting, onSort } = useSort<typeof columns>("last_update");

const rows = computed(() =>
  userMarkets.value.orderBy((x) => {
    switch (sorting.value.column) {
      case "collateral":
        return x.collateral;
      case "last_update":
        return Number(x.snapshotLast);
    }
  }, sorting.value.order)
);

function getCollateralIcon(userMarket: (typeof userMarkets.value)[number]) {
  return (
    markets.value.find((market) => market.address === userMarket.controller)
      ?.collateralToken.address ?? ""
  );
}

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
          :address="getCollateralIcon(item)"
        />

        <div>{{ item.collateral }}</div>
        <div class="end">{{ item.snapshotLast.toLocaleDateString() }}</div>
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
