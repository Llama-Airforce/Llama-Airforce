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

    <DataTable
      class="votes-incentives-table"
      :rows="rowsPage"
      :columns="columns"
    >
      <template #row="props: { item: Row }">
        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/address/${props.item.voter}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.voter) }}
          </a>
        </div>

        <div>
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${props.item.recipient}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.recipient) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(props.item.points)"
            :precision="2"
            :show-symbol="false"
            :show-zero="true"
          ></AsyncValue>
        </div>

        <div class="end">
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${props.item.transaction}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.transaction) }}
          </a>
        </div>

        <div class="end">
          {{ relativeTime(props.item.timestamp) }}
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import VePrismaService, {
  type VoteIncentive,
} from "@PM/Pages/VePrisma/VePrismaService";

type Row = VoteIncentive;

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

const rows = computed((): Row[] => data.value);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.votes-incentives-card {
  --header-columns: 1fr minmax(auto, 25rem) auto;
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
