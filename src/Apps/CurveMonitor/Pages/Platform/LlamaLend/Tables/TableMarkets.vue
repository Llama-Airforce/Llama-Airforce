<template>
  <Card
    :title
    :loading
  >
    <DataTable
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
      <template #row="{ item: market }: { item: Market }">
        <template v-if="market">
          <TokenIcon
            :chain
            :address="tokenIcon(market)"
          ></TokenIcon>

          <div>{{ name(market) }}</div>

          <div class="end">
            <AsyncValue
              v-if="market.borrow_apy"
              :value="market.borrow_apy"
              type="percentage"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="market.lend_apy"
              :value="market.lend_apy"
              type="percentage"
            />
          </div>

          <div class="end">
            <AsyncValue
              v-if="tvl(market)"
              :value="tvl(market)"
              type="dollar"
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
            :value="markets.filter(market => market).map(market => market!).reduce((acc, x) => acc + tvl(x), 0)"
            type="dollar"
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
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { type Chain } from "@CM/Models/Chain";
import { type Market, type MarketPair, tvl } from "@CM/Services/LlamaLend";

type Row = Market | undefined;

const { t } = useI18n();

// Emit
const emit = defineEmits<{
  selected: [market: Row];
}>();

// Props
interface Props {
  pairs: MarketPair[];
  loading: boolean;
  type: "long" | "short";
  chain: Chain;
}

const { pairs = [], loading, type, chain } = defineProps<Props>();

// Refs
const title = computed(() => t(type === "long" ? "title-long" : "title-short"));

const markets = computed((): Row[] =>
  chain_(pairs)
    .map((pair) => {
      const count = (pair.long ? 1 : 0) + (pair.short ? 1 : 0);
      return { count, ...pair };
    })
    .orderBy(
      ["count", ({ long, short }) => tvl(long) + tvl(short)],
      ["desc", "desc"]
    )
    .map(({ long, short }) => (type === "long" ? long : short))
    .value()
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.markets-table {
  --col-width: 10ch;
  --columns-data: 1rem 26px minmax(12ch, 1fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.25fr);

  img {
    aspect-ratio: 1;
    max-width: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
}
</style>

<i18n lang="yaml" locale="en">
title-long: Markets - Long
title-short: Markets - Short
</i18n>
