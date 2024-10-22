<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Market, type MarketPair, tvl } from "@CM/Services/LlamaLend";

const {
  pairs = [],
  loading,
  type,
  chain,
} = defineProps<{
  pairs: MarketPair[];
  loading: boolean;
  type: "long" | "short";
  chain: Chain;
}>();

const emit = defineEmits<{
  selected: [market?: Market];
}>();

// Refs
const title = computed(() =>
  type === "long" ? "Markets - Long" : "Markets - Short"
);

const markets = computed(() =>
  pairs
    .map((pair) => {
      const count = (pair.long ? 1 : 0) + (pair.short ? 1 : 0);
      return { count, ...pair };
    })
    .orderBy(
      [(x) => x.count, ({ long, short }) => tvl(long) + tvl(short)],
      ["desc", "desc"]
    )
    .map(({ long, short }) => (type === "long" ? long : short))
);

// Methods
function name(market: Market) {
  return market.name.replace(/(-long|-short)/i, "");
}

const tokenIcon = (market: Market) => {
  return type === "long"
    ? market.collateral_token.address
    : market.borrowed_token.address;
};
</script>

<template>
  <Card
    :title
    :loading
  >
    <Table
      class="markets-table"
      expand-side="left"
      :rows="markets"
      :columns="[
        '',
        '',
        'Name',
        { label: 'Borrow Rate', align: 'end' },
        { label: 'Lend Rate', align: 'end' },
        { label: 'TVL', align: 'end' },
        { label: 'Loans', align: 'end' },
      ]"
      @selected="emit('selected', $event)"
    >
      <template #row="{ item: market }">
        <template v-if="market">
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
            :value="markets.filter(market => market).map(market => market!).reduce((acc, x) => acc + tvl(x), 0)"
          />
        </div>
        <div class="end">
          {{
            markets
              .filter((market) => market)
              .map((market) => market!)
              .reduce((acc, x) => acc + x.n_loans, 0)
          }}
        </div>
      </template>

      <!-- Empty for expander arrow and pointer on hover -->
      <template #row-details> &nbsp; </template>
    </Table>
  </Card>
</template>

<style scoped>
.markets-table {
  --col-width: 10ch;
  --columns-data: 1rem 26px minmax(12ch, 1fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.25fr);
}
</style>
