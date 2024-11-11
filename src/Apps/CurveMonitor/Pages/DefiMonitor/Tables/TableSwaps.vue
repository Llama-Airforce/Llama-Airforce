<script setup lang="ts">
import { addressLeft } from "@/Utils/Wallet";
import { useQuerySwaps } from "@CM/Services/Monitor/Swap/Queries";
import WatchlistSwappers from "../Components/WatchlistSwappers.vue";
import type { Swapper } from "../Models";

// Options
const swappers = ref<Swapper[]>([]);

const minAmount = ref<number | null | string>(0);
const minAmountParsed = computed(() => {
  const value = minAmount.value;
  return typeof value === "string" ? parseFloat(value) || 0 : value ? value : 0;
});

/**
 * Data
 *
 * TODO: When 'swappers' changes and data is refetched, the old data is discarded.
 * Setting resetOnSubscribe to false won't help because the key changes and is highly volatile.
 * It's best to keep resetOnSubscribe set to true and track the history in this component.
 * Consider creating a composable that watches a ref and appends data whenever new data is added.
 * The composable would take a Ref<T[]> and output a new Ref<T[]>, essentially maintaining
 * a history of all values.
 */
const { data: swapsRaw, isFetching: loading } = useQuerySwaps(
  computed(() => swappers.value.map((swapper) => swapper.address))
);
const { relativeTime } = useRelativeTime();

const search = ref("");

const swaps = computed(() =>
  (swapsRaw.value ?? [])
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      const isMinAmount =
        row.parsedBeforeAmount >= minAmountParsed.value ||
        row.parsedAfterAmount >= minAmountParsed.value;

      return (
        (includesTerm(row.coinAfterAddress) ||
          includesTerm(row.coinAfterSymbol) ||
          includesTerm(row.coinBeforeAddress) ||
          includesTerm(row.coinBeforeSymbol)) &&
        isMinAmount
      );
    })
    .orderBy([(x) => x.blockUnixtime, (x) => x.positionInBlock], "desc")
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(swaps, rowsPerPage);

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);
</script>

<template>
  <Card
    class="swaps-card"
    title="Swaps"
    :loading
  >
    <template #actions>
      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          search
          placeholder="Search for..."
        />

        <Pagination
          v-if="swaps.length > rowsPerPage"
          :items-count="swaps.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        />
      </div>
    </template>

    <div class="swaps-card-body">
      <div class="swaps-options">
        <div class="option">
          <div class="label">Watchlist</div>

          <WatchlistSwappers @swappers="swappers = $event" />
        </div>

        <div class="option">
          <div class="label">Min Amount</div>
          <InputNumber
            v-model="minAmount"
            :min="0"
            :max="Infinity"
          />
        </div>
      </div>

      <Table
        class="swaps-table"
        :rows="rowsPage"
        :columns="[
          'Hash',
          'Block',
          'Gas',
          'From',
          'To',
          'In',
          'Out',
          { label: 'Age', align: 'end' },
        ]"
      >
        <template #row="{ item }">
          <div class="center-vert">
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/tx/${item.txHash}`"
            >
              {{ addressLeft(item.txHash, 10) }}
            </a>
          </div>

          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/block/${item.blockNumber}`"
            >
              {{ item.blockNumber }}
            </a>
          </div>

          <div>
            {{ item.gasInGwei }}
          </div>

          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/address/${item.senderAddress}`"
            >
              {{ addressLeft(item.senderAddress, 5) }}
            </a>
          </div>

          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/address/${item.receiverAddress}`"
            >
              {{ addressLeft(item.receiverAddress, 5) }}
            </a>
          </div>

          <div class="center-vert">
            <TokenIcon
              chain="ethereum"
              :address="item.coinBeforeAddress"
            />

            {{ round(item.parsedBeforeAmount) }}

            <a
              target="_blank"
              :href="`https://etherscan.io/address/${item.coinBeforeAddress}`"
            >
              {{ item.coinBeforeSymbol }}
            </a>
          </div>

          <div class="center-vert">
            <TokenIcon
              chain="ethereum"
              :address="item.coinAfterAddress"
            />

            {{ round(item.parsedAfterAmount) }}

            <a
              target="_blank"
              :href="`https://etherscan.io/address/${item.coinAfterAddress}`"
            >
              {{ item.coinAfterSymbol }}
            </a>
          </div>

          <div class="end">
            <a
              target="_blank"
              :href="`https://etherscan.io/tx/${item.txHash}`"
              @click.stop
            >
              {{ relativeTime(item.blockUnixtime) }}
            </a>
          </div>
        </template>
      </Table>
    </div>
  </Card>
</template>

<style scoped>
.swaps-card {
  --header-column-title: 3fr;
  --header-column-actions: 4fr;

  .swaps-card-body {
    display: flex;
    gap: var(--card-margin-inline);
  }
}

.swaps-options {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  min-width: 250px;
  margin-top: 1.125rem;
  padding-right: calc(1.5 * var(--card-margin-inline));

  border-right: 1px solid var(--c-lvl2);

  > .option {
    display: flex;
    flex-direction: column;
    gap: 1ch;

    .label {
      font-weight: bolder;
    }
  }
}

.swaps-table {
  --columns-gap: 2rem;
  --columns-data: minmax(3rem, 7rem) minmax(3rem, 5rem) minmax(2rem, 3rem)
    minmax(3rem, 5rem) minmax(3rem, 5rem) minmax(calc(26px + 8rem), 1fr)
    minmax(calc(26px + 8rem), 1fr) minmax(5rem, 9rem);

  width: 100%;

  .center-vert {
    display: flex;
    align-items: center;
    gap: 1ch;
  }
}
</style>
