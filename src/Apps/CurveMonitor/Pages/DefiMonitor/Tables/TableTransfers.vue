<script setup lang="ts">
import { addressShort, addressLeft } from "@/Wallet";
import { useQueryTransfers } from "@CM/Services/Monitor/Transfer/Queries";
import WatchlistTokens from "../Components/WatchlistTokens.vue";
import { type Token } from "../Models";

// Options
const tokens = ref<Token[]>([]);

const minAmount = ref<number | null | string>(0);
const minAmountParsed = computed(() => {
  const value = minAmount.value;
  return typeof value === "string" ? parseFloat(value) || 0 : value ? value : 0;
});

/**
 * Data
 *
 * TODO: When 'tokens' changes and data is refetched, the old data is discarded.
 * Setting resetOnSubscribe to false won't help because the key changes and is highly volatile.
 * It's best to keep resetOnSubscribe set to true and track the history in this component.
 * Consider creating a composable that watches a ref and appends data whenever new data is added.
 * The composable would take a Ref<T[]> and output a new Ref<T[]>, essentially maintaining
 * a history of all values.
 */
const { data: transfersRaw, isFetching: loading } = useQueryTransfers(
  computed(() => tokens.value.map((token) => token.address))
);

const { relativeTime } = useRelativeTime();

const search = ref("");

const transfers = computed(() =>
  (transfersRaw.value ?? [])
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return (
        (includesTerm(row.transferFrom) || includesTerm(row.transferTo)) &&
        row.parsedAmount >= minAmountParsed.value
      );
    })
    .orderBy([(x) => x.blockUnixtime, (x) => x.positionInBlock], "desc")
);

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(transfers, rowsPerPage);

const round = (x: number) =>
  x < 1 ? x.toFixed(4) : x > 1000 ? x.toFixed(0) : x.toFixed(2);

const clipboard = async (addr: string) => {
  await navigator.clipboard.writeText(addr);
};
</script>

<template>
  <Card
    class="transfers-card"
    title="Transfers"
  >
    <template #actions>
      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          search
          placeholder="Search for..."
        >
        </InputText>

        <Pagination
          v-if="transfers.length > rowsPerPage"
          :items-count="transfers.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <div class="transfers-card-body">
      <div class="transfers-options">
        <div class="option">
          <WatchlistTokens @tokens="tokens = $event"></WatchlistTokens>
        </div>

        <div class="option">
          <div class="label">Min Amount</div>

          <InputNumber
            v-model="minAmount"
            :min="0"
            :max="Infinity"
          ></InputNumber>
        </div>
      </div>

      <Table
        class="transfers-table"
        :rows="rowsPage"
        :columns="[
          'Hash',
          'Block',
          'Gas',
          'From',
          'To',
          'Amount',
          'Token',
          { label: 'Age', align: 'end' },
        ]"
        :loading
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

            <Button @click="clipboard(item.txHash)">
              <LucideLink />
            </Button>
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

          <div class="no-ellipsis">
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/address/${item.transferFrom}`"
            >
              {{ addressShort(item.transferFrom, 10) }}
            </a>
          </div>

          <div class="no-ellipsis">
            <a
              class="font-mono"
              target="_blank"
              :href="`https://etherscan.io/addr ess/${item.transferTo}`"
            >
              {{ addressShort(item.transferTo, 10) }}
            </a>
          </div>

          <div>{{ round(item.parsedAmount) }}</div>

          <div class="center-vert">
            <TokenIcon
              class="token"
              chain="ethereum"
              :address="item.coinAddress"
            ></TokenIcon>

            <a
              target="_blank"
              :href="`https://etherscan.io/address/${item.coinAddress}`"
            >
              {{ item.coinSymbol }}
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
.transfers-card {
  --header-column-title: 3fr;
  --header-column-actions: 4fr;

  .transfers-card-body {
    display: flex;
    gap: var(--card-margin-inline);
  }
}

.transfers-options {
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

.transfers-table {
  --columns-gap: 2rem;
  --columns-data: minmax(6rem, 1fr) minmax(5rem, 1fr) 5rem minmax(5rem, 1fr)
    minmax(5rem, 1fr) minmax(5rem, 1fr) calc(26px + 8rem) minmax(5rem, 1fr);

  button {
    background: transparent;

    &:hover,
    &:active {
      background: transparent;
    }
  }

  .no-ellipsis {
    text-overflow: clip;
  }

  .center-vert {
    display: flex;
    align-items: center;
    gap: 1ch;
  }
}
</style>
