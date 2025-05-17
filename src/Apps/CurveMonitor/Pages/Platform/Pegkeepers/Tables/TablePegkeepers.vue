<script setup lang="ts">
import { useQueryKeepers } from "@CM/queries/crvusd";
import { useQueryPoolMultiple } from "@CM/queries/pools";
import type { Keeper } from "@curvefi/prices-api/crvusd";

const search = ref("");

const loading = computed(() => loadingPools.value || loadingKeepers.value);

const rowsRaw = computed(() =>
  keepers.value
    .filter((keeper) => keeper.active)
    .map((keeper) => {
      const pool = pools.value.find(
        (pool) => keeper.poolAddress === pool.address
      );

      if (!pool) {
        return undefined;
      }

      return {
        ...pool,
        ...keeper,
        pool: pool.address,
      };
    })
    .filter(notEmpty)
    .orderBy((x) => x.tvlUsd, "desc")
);

const rows = computed(() =>
  rowsRaw.value.filter((row) => {
    const terms = search.value.toLocaleLowerCase().split(" ");

    const includesTerm = (x: string): boolean =>
      terms.some((term) => x.toLocaleLowerCase().includes(term));

    return includesTerm(row.name) || includesTerm(row.address);
  })
);

// Keepers
const { isFetching: loadingKeepers, data: keepers } = useQueryKeepers();
const name = (keeper: Keeper): string =>
  `${keeper.pair[1].symbol} / ${keeper.pair[0].symbol}`;

// Pools
const poolAddresses = computed(() =>
  keepers.value.map((keeper) => keeper.poolAddress)
);

const poolQueries = useQueryPoolMultiple(ref("ethereum"), poolAddresses);
const loadingPools = computed(() =>
  poolQueries.value.some((x) => x.isFetching)
);
const pools = computed(() =>
  poolQueries.value.filter((x) => x.data).map((x) => x.data!)
);

// Methods
const decimals = (x: number): number => (x >= 1_000_000 ? 2 : 0);
const tokenAddress = (x: (typeof rowsRaw.value)[number]) =>
  x.pair.filter((x) => x.address.toLocaleLowerCase() !== CrvUsdAddress)[0]
    .address;
</script>

<template>
  <Card
    class="pegkeepers-card"
    title="Pegkeepers"
    :loading
  >
    <template #actions>
      <InputText
        v-model="search"
        search
        placeholder="Search for.."
      />
    </template>

    <Table
      class="pegkeepers-table"
      :rows
      :columns="[
        '',
        'Name',
        { label: 'Debt', align: 'end' },
        { label: 'TVL', align: 'end' },
        { label: 'Volume', align: 'end' },
        { label: 'Fees', align: 'end' },
      ]"
    >
      <template #row="{ item }">
        <TokenIcon
          chain="ethereum"
          :address="tokenAddress(item)"
        />

        <div>{{ name(item) }}</div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.totalDebt"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.tvlUsd"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.tradingVolume24h"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="item.totalProfit"
            :precision="decimals"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.sumBy((x) => x.totalDebt)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.sumBy((x) => +x.tvlUsd)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.sumBy((x) => x.tradingVolume24h)"
            :precision="decimals"
          />
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="rows.sumBy((x) => x.totalProfit)"
            :precision="decimals"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.pegkeepers-card {
  --header-column-title: minmax(7rem, 1fr);
  --header-column-actions: minmax(auto, 25rem);
}

.pegkeepers-table {
  --col-width: 11ch;
  --columns-data: 26px minmax(7rem, 1fr)
    repeat(4, minmax(var(--col-width), 0.75fr));
}
</style>
