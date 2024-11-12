<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import {
  TroveService,
  type Trove,
  type TroveManagerDetails,
} from "@PM/Services";

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const troveService = new TroveService(storeSettings.flavor);

const { vault = null, trove = null } = defineProps<{
  vault?: TroveManagerDetails | null;
  trove?: Trove | null;
}>();

// Refs
const { relativeTime } = useRelativeTime();

const rows = computed(() => data.value.orderBy((row) => row.timestamp, "desc"));

// Data
const { isFetching: loading, data } = useQuery({
  queryKey: [
    "prisma-trove-snapshots",
    computed(() => vault?.address),
    computed(() => trove?.owner),
  ] as const,
  queryFn: ({ queryKey: [, vault, owner] }) => {
    if (vault && owner) {
      return troveService
        .getTroveSnapshots("ethereum", vault, owner)
        .then((x) => x.snapshots);
    } else {
      return Promise.resolve([]);
    }
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

const titleCase = (s: string): string =>
  s.replace(/^_*(.)|_+(.)/g, (_, c: string, d: string) =>
    c ? c.toUpperCase() : " " + d.toUpperCase()
  );
</script>

<template>
  <Card
    :title="t('title')"
    :loading
  >
    <Table
      class="trove-ops-table"
      :rows
      :columns="[
        'Operation',
        { label: 'Collateral', align: 'end' },
        { label: 'Debt', align: 'end' },
        { label: 'Ratio', align: 'end' },
        { label: 'Stake', align: 'end' },
        { label: 'Tx', align: 'end' },
        { label: 'Time', align: 'end' },
      ]"
    >
      <template #row="{ item }">
        <div>{{ titleCase(item.operation) }}</div>

        <div class="end">
          <AsyncValue
            v-if="item.collateral"
            type="dollar"
            :value="item.collateral"
            :precision="3"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(item.debt)"
            :precision="Infinity"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="item.cr"
            type="percentage"
            :value="item.cr * 100"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="item.stake"
            type="dollar"
            :value="item.stake"
            :precision="2"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/tx/${item.hash}`"
            @click.stop
          >
            {{ addressShort(item.hash) }}
          </a>
        </div>

        <div class="end">
          {{ relativeTime(item.timestamp) }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.trove-ops-table {
  --columns-data: minmax(14ch, 0.75fr) repeat(5, minmax(12ch, 0.75fr)) 1fr;

  .title {
    margin-right: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Operations
</i18n>
