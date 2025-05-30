<script setup lang="ts">
import type { Cooldown } from "@HA/services/staking/schema";

const { cooldowns } = defineProps<{
  cooldowns: Cooldown[];
}>();

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(
  toRef(() => cooldowns),
  rowsPerPage
);

const { relativeTime } = useRelativeTime();
</script>

<template>
  <Card title="Cooldown Queue">
    <template #actions>
      <Pagination
        :items-count="cooldowns.length"
        :items-per-page="rowsPerPage"
        :page
        @page="onPage"
      />
    </template>

    <Table
      :rows="rowsPage"
      :columns="[
        'User',
        { label: 'RSUP', align: 'end' },
        { label: 'Dollars', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: cooldown }">
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${cooldown.account.address}`"
            @click.stop
          >
            {{ cooldown.account.ens || addressShort(cooldown.account.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="cooldown.amount"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="cooldown.amountUsd"
            :precision="2"
          />
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${cooldown.txHash}`"
            @click.stop
          >
            {{ relativeTime(cooldown.end.getUTCTimestamp()) }}
          </a>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(8rem, 1fr) minmax(4rem, 8rem) minmax(4rem, 8rem) 6rem;
}
</style>
