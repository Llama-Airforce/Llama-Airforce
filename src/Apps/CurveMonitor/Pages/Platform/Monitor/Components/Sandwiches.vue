<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { roundPhil } from "@/Util";
import Transactions from "@CM/Pages/Platform/Monitor/Components/Transactions.vue";
import { useQuerySandwiches } from "@CM/Services/Monitor/MEV/Queries";
import type { SandwichDetail } from "@CM/Services/Monitor/SocketMonitorCurve";

const swsPerPage = 10;

const page = ref(1);
const { data: sandwichesRaw, isFetching: loading } = useQuerySandwiches();

const { expanded, toggleExpansion } = useExpansion<SandwichDetail>();
const { relativeTime } = useRelativeTime();

const search = ref("");

const numSandwiches = computed(
  () => sandwichesRaw.value?.totalPages ?? 0 * swsPerPage
);

const sandwiches = computed(() =>
  (sandwichesRaw.value?.data ?? [])
    .filter((sw) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return (
        includesTerm(sw.poolName) ||
        includesTerm(sw.poolAddress) ||
        includesTerm(sw.label)
      );
    })
    .orderBy(
      [(x) => x.frontrun.block_unixtime, (x) => x.frontrun.tx_position],
      "desc"
    )
);

const sandwichTxs = (sw: SandwichDetail) =>
  [sw.frontrun, ...sw.center, sw.backrun].orderBy([
    (x) => x.block_unixtime,
    (x) => x.tx_position,
  ]);
</script>

<template>
  <Card
    class="sandwiches-card"
    title="Sandwiches"
    :loading
  >
    <template #actions>
      <div style="display: flex; gap: 1rem">
        <InputText
          v-model="search"
          class="search"
          placeholder="Search for..."
          :search="true"
        >
        </InputText>

        <Pagination
          v-if="numSandwiches > swsPerPage"
          class="pagination"
          :items-count="numSandwiches"
          :items-per-page="swsPerPage"
          :page
          @page="page = $event"
        ></Pagination>
      </div>
    </template>

    <Table
      class="sandwiches-table"
      :rows="sandwiches"
      :columns="[
        'Pool',
        'Action',
        'Affected Contract',
        { label: 'Time', align: 'end' },
      ]"
      :expanded
      @selected="toggleExpansion($event)"
    >
      <template #row="{ item }">
        <div>
          <a
            class="vote-link"
            :href="`https://etherscan.io/address/${item.poolAddress}`"
            target="_blank"
          >
            {{ item.poolName }}
          </a>
        </div>

        <div>
          <div
            style="
              display: grid;
              gap: 1ch;
              grid-template-columns: auto 16ch 1fr;
            "
          >
            <a
              class="vote-link font-mono"
              target="_blank"
              :href="`https://etherscan.io/address/${item.center[0].trader}`"
            >
              {{ addressShort(item.center[0].trader) }}
            </a>
            <span>
              lost
              {{
                roundPhil(
                  item.user_losses_details.reduce((acc, x) => acc + x.amount, 0)
                )
              }}
              {{ item.user_losses_details[0].unit }}
            </span>
            <span>
              {{ roundPhil(-item.user_losses_details[0].lossInPercentage) }}%
              slippage, or ${{ roundPhil(item.lossInUsd) }}
            </span>
          </div>
        </div>

        <div>
          {{ item.label }}
        </div>

        <div class="end">
          {{ relativeTime(item.frontrun.block_unixtime) }}
        </div>
      </template>

      <template #row-details="{ item }">
        <Transactions
          class="transactions"
          :txs="sandwichTxs(item)"
          :header="false"
          :compact="true"
          :time="false"
        ></Transactions>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.sandwiches-card {
  --header-column-actions: 2fr;

  .search {
    width: 600px;

    @media only screen and (max-width: 1280px) {
      width: auto;
    }
  }
}

.sandwiches-table {
  --columns-data: 16rem 1fr 16rem 8rem 1rem;

  .title {
    margin-right: 1rem;
  }
}
</style>
