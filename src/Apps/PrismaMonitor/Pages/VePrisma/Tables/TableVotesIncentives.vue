<template>
  <DataTable
    class="datatable-votes-incentives"
    columns-header="1fr minmax(auto, 25rem)"
    columns-data="votes-incentives-columns-data"
    :loading="loading"
    :rows="rowsPage"
    :columns="columns"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>
    </template>

    <template #header-actions>
      <Pagination
        class="pagination"
        :items-count="rows.length"
        :items-per-page="rowsPerPage"
        :page="page"
        @page="onPage"
      ></Pagination>
    </template>

    <template #row="props: { item: Row }">
      <div>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/address/${props.item.voter}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.voter) }}
        </a>
      </div>

      <div>
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/tx/${props.item.recipient}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.recipient) }}
        </a>
      </div>

      <div class="number">
        <AsyncValue
          type="dollar"
          :value="Math.round(props.item.weight)"
          :precision="2"
          :show-symbol="false"
          :show-zero="true"
        ></AsyncValue>
      </div>

      <div class="number">
        <a
          style="font-family: monospace"
          :href="`https://etherscan.io/tx/${props.item.transaction}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.transaction) }}
        </a>
      </div>

      <div class="number">
        {{ relativeTime(props.item.timestamp) }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  AsyncValue,
  DataTable,
  Pagination,
  usePagination,
  useData,
  useRelativeTime,
} from "@/Framework";
import { addressShort } from "@/Wallet";
import { getHost } from "@/Services/Host";
import VePrismaService, {
  type VoteIncentive,
} from "@PM/Pages/VePrisma/VePrismaService";

type Row = VoteIncentive;

const { t } = useI18n();

const vePrismaService = new VePrismaService(getHost());

// Data
const { loading, data } = useData(
  () => vePrismaService.getVotesIncentives(),
  []
);

// Refs
const { relativeTime } = useRelativeTime();

const columns = computed((): string[] => {
  return ["Voter", "Recipient", "Weight", "Tx", "Time"];
});

const rows = computed((): Row[] => data.value);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-votes-incentives {
  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  ::v-deep(.votes-incentives-columns-data) {
    --col-width: 11ch;

    display: grid;
    grid-template-columns: minmax(12ch, 1fr) minmax(12ch, 1fr) repeat(
        3,
        minmax(var(--col-width), 0.75fr)
      );

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;
    }

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Incentive votes
</i18n>
