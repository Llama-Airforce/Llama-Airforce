<script setup lang="ts">
import type { Redemption } from "@HA/services/pairs/schema";
import type { Pair } from "@HA/services/protocols/schema";

const {
  redemptions: rows,
  count,
  pair,
  loading,
} = defineProps<{
  redemptions: Redemption[];
  count: number;
  pair: Pair;
  loading: boolean;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);
watch(pageDebounced, (page) => {
  emit("page", page);
});

const { relativeTime } = useRelativeTime();
</script>

<template>
  <Card title="Redemptions">
    <template #actions>
      <Pagination
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </template>

    <Table
      v-if="rows.length > 0"
      :rows
      :columns="[
        'Caller',
        { label: 'reUSD', align: 'end' },
        { label: 'Debt reduction', align: 'end' },
        { label: 'Collateral freed', align: 'end' },
        { label: 'Protocol fee', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item: event }">
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${event.caller}`"
            @click.stop
          >
            {{ event.caller.ens || addressShort(event.caller.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.amount / 10 ** 18"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.debtReduction / 10 ** 18"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div
          class="end"
          style="display: flex; gap: 1ch"
        >
          <AsyncValue
            type="dollar"
            :value="event.collateralFreed / 10 ** 18"
            :precision="2"
            :show-symbol="false"
          />
          {{ pair.tokenCollateral.symbol }}
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="event.protocolFee / 10 ** 18"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <a
            target="_blank"
            :href="`https://etherscan.io/tx/${event.txHash}`"
            @click.stop
          >
            {{ relativeTime(event.blockTime.getUTCTimestamp()) }}
          </a>
        </div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      message="There are no redemptions"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 10rem 1fr 1fr 1fr 1fr 6rem;
}
</style>
