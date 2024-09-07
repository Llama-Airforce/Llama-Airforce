<script setup lang="ts">
import { addressShort } from "@/Wallet";
import VePrismaService from "@PM/Pages/VePrisma/VePrismaService";

const { t } = useI18n();

const vePrismaService = new VePrismaService();

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-vote-incentives"],
  queryFn: () => vePrismaService.getVotesIncentives(),
  initialData: [],
  initialDataUpdatedAt: 0,
});

// Refs
const { relativeTime } = useRelativeTime();

const columns = computed(() => {
  return [
    "Voter",
    "Recipient",
    { label: "Points", align: "end" } as const,
    { label: "Tx", align: "end" } as const,
    { label: "Time", align: "end" } as const,
  ];
});

const rows = computed(() => data.value);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<template>
  <Card
    class="votes-incentives-card"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <Pagination
        :items-count="rows.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <Table
      class="votes-incentives-table"
      :rows="rowsPage"
      :columns="columns"
    >
      <template #row="{ item }">
        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${item.voter}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.voter) }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${item.recipient}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.recipient) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(item.points)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>

        <div class="end">
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${item.transaction}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(item.transaction) }}
          </a>
        </div>

        <div class="end">
          {{ relativeTime(item.timestamp) }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
.votes-incentives-card {
  --header-column-actions: minmax(auto, 25rem) auto;
}

.votes-incentives-table {
  --col-width: 11ch;
  --columns-data: minmax(12ch, 1fr) minmax(12ch, 1fr)
    repeat(3, minmax(var(--col-width), 0.75fr));
}
</style>

<i18n lang="yaml" locale="en">
title: Incentive votes
</i18n>
