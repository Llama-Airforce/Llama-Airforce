<script setup lang="ts">
import { type Address } from "@/Framework/Address";
import { addressShort, addressLeft } from "@/Wallet";
import { useQueryTransfers } from "@CM/Services/Monitor/Transfer/Queries";

// Options
type Option = { address: Address | Address[]; symbol: string };
const options: Option[] = [
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
  },
  {
    address: [
      "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    ],
    symbol: "Both",
  },
];
const selected = ref(options[0]);

const minAmount = ref<number | null | string>(0);
const minAmountParsed = computed(() => {
  const value = minAmount.value;
  return typeof value === "string" ? parseFloat(value) || 0 : value ? value : 0;
});

// Data
const { data: transfersRaw, isFetching: loading } = useQueryTransfers(
  computed(() => selected.value.address)
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
          <div class="label">Token</div>
          <Select
            :options
            :selected
            @input="selected = $event"
          >
            <template #item="{ item: { address, symbol } }">
              <div class="item">
                <TokenIcon
                  v-if="!Array.isArray(address)"
                  class="icon"
                  :address="address"
                ></TokenIcon>

                <div class="label">{{ symbol ?? "?" }}</div>
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

            <Button
              icon="fas fa-link"
              @click="clipboard(item.txHash)"
            ></Button>
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
              :href="`https://etherscan.io/address/${item.transferFrom}`"
              target="_blank"
            >
              {{ addressShort(item.transferFrom, 10) }}
            </a>
          </div>

          <div>
            <a
              class="font-mono"
              :href="`https://etherscan.io/addr ess/${item.transferTo}`"
              target="_blank"
            >
              {{ addressShort(item.transferTo, 10) }}
            </a>
          </div>

          <div>{{ round(item.parsedAmount) }}</div>

          <div class="token">
            <TokenIcon
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
.transfers-card {
  --header-column-title: 3fr;
  --header-column-actions: 4fr;

  .transfers-card-body {
    width: 100%;
    display: flex;
    gap: var(--card-margin-inline);
  }
}

.transfers-options {
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

  .item {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}

.transfers-table {
  --columns-data: minmax(6rem, 1fr) minmax(5rem, 1fr) 5rem minmax(5rem, 1fr)
    minmax(5rem, 1fr) minmax(5rem, 1fr) calc(26px + 8rem) minmax(5rem, 1fr);

  :deep(.row-data) {
    grid-column-gap: 2rem;
  }

  button {
    background: transparent;

    &:hover,
    &:active {
      background: transparent;
    }
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
