<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import {
  type Market,
  type MarketPair,
  tvl,
} from "@curvefi/prices-api/llamalend";

type MarketType = "long" | "short";

const { pairs, loading, chain } = defineProps<{
  pairs: MarketPair[];
  loading: boolean;
  chain: Chain;
}>();

const emit = defineEmits<{
  select: [market?: Market];
}>();

const columns = [
  "",
  "",
  "Name",
  { id: "borrow", label: "Borrow Rate", align: "end", sort: true } as const,
  { id: "lend", label: "Lend Rate", align: "end", sort: true } as const,
  { id: "tvl", label: "TVL", align: "end", sort: true } as const,
  { id: "loans", label: "Loans", align: "end", sort: true } as const,
];

const { sorting, onSort } = useSort<typeof columns>("tvl");

const type = ref<MarketType>("long");
function onType(tabIndex: number) {
  if (tabIndex === 0) {
    type.value = "long";
  } else if (tabIndex === 1) {
    type.value = "short";
  } else {
    type.value = "long";
  }
}

const rows = computed(() =>
  pairs
    .map(({ long, short }) => (type.value === "long" ? long : short))
    .filter((x) => !!x)
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "borrow":
          return x.apyBorrow;
        case "lend":
          return x.apyLend;
        case "tvl":
          return tvl(x);
        case "loans":
          return x.nLoans;
      }
    }, sorting.value.order)
);

function name(market: Market) {
  return market.name.replace(/(-long|-short)/i, "");
}

const tokenIcon = (market: Market) =>
  type.value === "long"
    ? market.collateralToken.address
    : market.borrowedToken.address;
</script>

<template>
  <Card
    title="Markets"
    :loading
  >
    <template #actions>
      <TabView
        class="types"
        @tab="onType($event.index)"
      >
        <TabItem header="Long" />
        <TabItem header="Short" />
      </TabView>
    </template>

    <Table
      v-if="rows.length > 0"
      class="markets-table"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
      @select="emit('select', $event)"
    >
      <template #row="{ item: market }">
        <template v-if="market">
          <IconExpander />

          <TokenIcon
            :chain
            :address="tokenIcon(market)"
          />

          <div>{{ name(market) }}</div>

          <div class="end">
            <AsyncValue
              v-if="market.apyBorrow"
              type="percentage"
              :value="market.apyBorrow"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="market.apyLend"
              type="percentage"
              :value="market.apyLend"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="tvl(market)"
              type="dollar"
              :value="tvl(market)"
            />
          </div>

          <div class="end">{{ market.nLoans }}</div>
        </template>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.filter(market => market).map(market => market!).reduce((acc, x) => acc + tvl(x), 0)"
          />
        </div>
        <div class="end">
          {{
            rows
              .filter((market) => market)
              .map((market) => market!)
              .reduce((acc, x) => acc + x.nLoans, 0)
          }}
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`There are no ${type} markets for ${chain}`"
    />
  </Card>
</template>

<style scoped>
.markets-table {
  --col-width: 10ch;
  --columns-data: 1rem 26px minmax(12ch, 1fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.25fr);
}

.types {
  margin: 0 1rem;
}
</style>
