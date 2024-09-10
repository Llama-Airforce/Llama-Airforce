<script setup lang="ts">
import { type Keeper } from "@CM/Services/CrvUsd";
import { type Pool } from "@CM/Services/Pools";
import { useQueryKeepers } from "@CM/Services/CrvUsd/Queries";
import { useQueryPoolMultiple } from "@CM/Services/Pools/Queries";

// Refs
const search = ref("");

const loading = computed(() => loadingPools.value || loadingKeepers.value);

const rowsRaw = computed(() =>
  keepers.value
    .map((keeper) => {
      const pool = pools.value.find(
        (pool) => keeper.pool_address === pool.address
      );

      if (!pool) {
        return undefined;
      }

      return {
        ...pool,
        ...keeper,
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
  keepers.value.map((keeper) => keeper.pool_address)
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
const tokenAddress = (x: Pool & Keeper) =>
  x.pair.filter((x) => x.address !== CrvUsdAddress)[0].address;
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
        placeholder="Search for.."
        :search="true"
      >
      </InputText>
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
        ></TokenIcon>

        <div>{{ name(item) }}</div>

        <div class="end">
          <AsyncValue
            :value="item.total_debt"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.tvlUsd"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.tradingVolume24h"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="item.total_profit"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.total_debt, 0)"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.tvlUsd, 0)"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.tradingVolume24h, 0)"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            :value="rows.reduce((acc, x) => acc + x.total_profit, 0)"
            :precision="decimals"
            :show-zero="true"
            type="dollar"
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
  --columns-data: 26px minmax(7rem, 1fr) repeat(4, 12ch);
}
</style>
