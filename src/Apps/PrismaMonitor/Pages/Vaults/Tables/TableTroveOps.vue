<template>
  <Card :title="t('title')">
    <DataTable
      class="datatable-trove-ops"
      :loading="loading"
      :rows="rows"
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
      <template #row="props: { item: Row }">
        <div>{{ titleCase(props.item.operation) }}</div>

        <div class="end">
          <AsyncValue
            v-if="props.item.collateral"
            :value="props.item.collateral"
            :precision="3"
            :show-symbol="false"
            type="dollar"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="Math.round(props.item.debt)"
            :precision="Infinity"
          ></AsyncValue>
        </div>

        <div class="end">
          <AsyncValue
            v-if="props.item.cr"
            :value="props.item.cr * 100"
            :precision="2"
            type="percentage"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="props.item.stake"
            :value="props.item.stake"
            :precision="2"
            :show-symbol="false"
            type="dollar"
          />
        </div>

        <div class="end">
          <a
            class="font-mono"
            :href="`https://etherscan.io/tx/${props.item.hash}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.hash) }}
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
import { orderBy } from "lodash";
import { addressShort } from "@/Wallet";
import { useSettingsStore } from "@PM/Stores";
import {
  TroveService,
  type Trove,
  type TroveSnapshotData,
  type TroveManagerDetails,
} from "@PM/Services";

type Row = TroveSnapshotData;

const { t } = useI18n();

// Stores
const storeSettings = useSettingsStore();

// Services
const troveService = new TroveService(storeSettings.flavor);

// Props
interface Props {
  vault?: TroveManagerDetails | null;
  trove?: Trove | null;
}
const { vault = null, trove = null } = defineProps<Props>();

// Refs
const { relativeTime } = useRelativeTime();

const rows = computed((): Row[] => {
  return orderBy(data.value, (row) => row.timestamp, "desc");
});

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-trove-ops {
  --columns-header: 1fr 1fr auto;

  --col-width: 12ch;
  --columns-data: minmax(14ch, 0.75fr)
    repeat(5, minmax(var(--col-width), 0.75fr)) 1fr;

  container-type: inline-size;

  .title {
    margin-right: 1rem;
  }

  :deep(.row-data) {
    --col-width: 12ch;

    // Mobile
    @media only screen and (max-width: 1280px) {
      gap: 0.25rem;

      @container (max-width: 800px) {
        --columns-data: minmax(14ch, 0.75fr)
          repeat(4, minmax(var(--col-width), 0.75fr)) 1fr;

        div:nth-child(5) {
          display: none;
        }
      }

      @container (max-width: 650px) {
        --columns-data: minmax(14ch, 0.75fr)
          repeat(3, minmax(var(--col-width), 0.75fr)) 1fr;

        div:nth-child(6) {
          display: none;
        }
      }

      @container (max-width: 520px) {
        --columns-data: minmax(14ch, 0.75fr)
          repeat(3, minmax(var(--col-width), 0.75fr));

        div:nth-child(7) {
          display: none;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Operations
</i18n>
