<script setup lang="ts">
import { type Address } from "@/Framework/Address";
import { addressLeft } from "@/Wallet";
import { useQuerySwaps } from "@CM/Services/Monitor/Swap/Queries";

// Options
const swappers = [
  {
    address: "0x111111125421ca6dc452d289314280a0f8842a65" as Address,
    name: "1inch V6",
  },
  {
    address: "0x1111111254eeb25477b68fb85ed929f73a960582" as Address,
    name: "1inch V5",
  },
];
const swapper = ref(swappers[0]);

const minAmount = ref<number | null | string>(0);
const minAmountParsed = computed(() => {
  const value = minAmount.value;
  return typeof value === "string" ? parseFloat(value) || 0 : value ? value : 0;
});

// Data
const { data: swapsRaw, isFetching: loading } = useQuerySwaps(
  computed(() => swapper.value.address)
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
          placeholder="Search for..."
          :search="true"
        >
        </InputText>

        <Pagination
          v-if="swaps.length > rowsPerPage"
          :items-count="swaps.length"
          :items-per-page="rowsPerPage"
          :page
          @page="onPage"
        ></Pagination>
      </div>
    </template>

    <div class="swaps-card-body">
      <div class="swaps-options">
        <div class="option">
          <div class="label">Token</div>
          <Select
            :options="swappers"
            :selected="swapper"
            @input="swapper = $event"
          >
            <template #item="{ item: { name } }">
              <div class="item">
                <div class="label">{{ name ?? "?" }}</div>
              </div>
            </template>
          </Select>
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
          <div class="hash">
            <a
              class="font-mono"
              :href="`https://etherscan.io/tx/${item.txHash}`"
              target="_blank"
            >
              {{ addressLeft(item.txHash, 10) }}
            </a>
          </div>

          <div>
            <a
              class="font-mono"
              :href="`https://etherscan.io/block/${item.blockNumber}`"
              target="_blank"
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
              :href="`https://etherscan.io/address/${item.coinBeforeAddress}`"
              target="_blank"
            >
              {{ addressLeft(item.coinBeforeAddress, 5) }}
            </a>
          </div>

          <div>
            <a
              class="font-mono"
              :href="`https://etherscan.io/address/${item.coinAfterAddress}`"
              target="_blank"
            >
              {{ addressLeft(item.coinAfterAddress, 5) }}
            </a>
          </div>

          <div class="token">
            <TokenIcon
              chain="ethereum"
              :address="item.coinBeforeAddress"
            ></TokenIcon>

            {{ round(item.parsedBeforeAmount) }}

            <a
              target="_blank"
              :href="`https://etherscan.io/address/${item.coinBeforeAddress}`"
            >
              {{ item.coinBeforeSymbol }}
            </a>
          </div>

          <div class="token">
            <TokenIcon
              chain="ethereum"
              :address="item.coinAfterAddress"
            ></TokenIcon>

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
              :href="`https://etherscan.io/tx/${item.txHash}`"
              target="_blank"
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.swaps-card {
  --header-columns: 3fr 4fr;

  .swaps-card-body {
    width: 100%;
    display: flex;
    gap: var(--card-margin-inline);
  }
}

.swaps-options {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

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
  --columns-data: minmax(3rem, 7rem) minmax(3rem, 5rem) minmax(2rem, 3rem)
    minmax(3rem, 5rem) minmax(3rem, 5rem) minmax(calc(26px + 8rem), 1fr)
    minmax(calc(26px + 8rem), 1fr) minmax(5rem, 9rem);

  width: 100%;

  :deep(.row-data) {
    grid-column-gap: 2rem;
  }

  .hash {
    display: flex;
    align-items: center;
    gap: 1ch;
  }

  .token {
    display: flex;
    align-items: center;
    gap: 1ch;

    img {
      height: 26px;
    }
  }
}
</style>
