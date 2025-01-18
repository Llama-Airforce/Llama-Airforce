<script setup lang="ts">
import type { Chain } from "@/Types/Chain";
import { type Market, type MarketPair, tvl } from "@CM/Services/llamalend";

type MarketType = "long" | "short";

const {
  pairs = [],
  loading,
  chain,
} = defineProps<{
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
          return x.borrow_apy;
        case "lend":
          return x.lend_apy;
        case "tvl":
          return tvl(x);
        case "loans":
          return x.n_loans;
      }
    }, sorting.value.order)
);

function name(market: Market) {
  return market.name.replace(/(-long|-short)/i, "");
}

const tokenIcon = (market: Market) => {
  return type.value === "long"
    ? market.collateral_token.address
    : market.borrowed_token.address;
};
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
              v-if="market.borrow_apy"
              type="percentage"
              :value="market.borrow_apy"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="market.lend_apy"
              type="percentage"
              :value="market.lend_apy"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="tvl(market)"
              type="dollar"
              :value="tvl(market)"
            />
          </div>

          <div class="end">{{ market.n_loans }}</div>
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
              .reduce((acc, x) => acc + x.n_loans, 0)
          }}
        </div>
      </template>
    </Table>

    <NoData
      v-else
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
