<script setup lang="ts">
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import {
  getDate,
  getDateRaw,
  getLink,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import type { EpochOverview, Overview } from "@LAF/Pages/Bribes/Models";

const { t } = useI18n();

const { overview } = defineProps<{
  overview?: Overview;
}>();

const { protocol } = storeToRefs(useBribesStore());

const router = useRouter();

const columns = computed(() => [
  "",
  { id: "deadline" as const, label: t("deadline"), sort: true as const },
  {
    id: "vlasset" as const,
    label: `$/${vlAssetSymbol(protocol.value)}`,
    sort: true as const,
    align: "end" as const,
  },
  {
    id: "total" as const,
    label: t("total"),
    sort: true as const,
    align: "end" as const,
  },
]);

const { sorting, onSort } = useSort<typeof columns.value>("deadline");

const epochs = computed(() =>
  (overview?.epochs ?? []).orderBy((epoch) => {
    switch (sorting.value.column) {
      case "deadline":
        return epoch.round;
      case "vlasset":
        return dollarPerVlAsset(epoch);
      case "total":
        return totalAmountDollars(epoch);
    }
  }, sorting.value.order)
);

// Methods
const round = (epoch: EpochOverview): number => epoch.round;

const voteLink = (epoch: EpochOverview): string =>
  getLink(epoch, epoch.proposal);

const dollarPerVlAsset = (epoch: EpochOverview): number =>
  epoch.dollarPerVlAsset;

const totalAmountDollars = (epoch: EpochOverview): number =>
  epoch.totalAmountDollars;

const date = (epoch: EpochOverview): string => getDate(epoch);

const isFinished = (epoch: EpochOverview): boolean =>
  new Date() > getDateRaw(epoch);

// Events
const onSelected = async (epoch: EpochOverview): Promise<void> => {
  await router.push({
    name: "rounds-incentives",
    params: { round: epoch.round },
  });
};
</script>

<template>
  <Card :title="t('all-rounds')">
    <template #actions>
      <Tooltip>{{ t("tooltip") }}</Tooltip>
    </template>

    <Table
      class="bribe-rounds-table"
      :rows="epochs"
      :columns
      :sorting
      @sort-column="onSort"
      @select="onSelected"
    >
      <template #row="{ item }">
        <div
          class="round-number"
          @click.stop
        >
          <a
            class="vote-link"
            target="_blank"
            :href="voteLink(item)"
          >
            <span v-if="isFinished(item)">{{ round(item) }}</span>
            <span v-else>
              <Tooltip>
                <template #trigger>
                  <LucideClock style="vertical-align: middle" />
                </template>

                <span class="content">{{ t("ongoing") }}</span>
              </Tooltip>
            </span>
          </a>
        </div>

        <div>
          {{ date(item) }}
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="dollarPerVlAsset(item)"
            :precision="5"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="totalAmountDollars(item)"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.bribe-rounds-table {
  --columns-data: 1.5rem 1fr 1fr 1fr;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vote-link {
    width: 1.5rem;
    text-align: center;

    .tooltip {
      justify-content: center;

      .content {
        color: var(--c-text);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
deadline: Deadline
total: Total
all-rounds: All Rounds
tooltip: Dollar values for finished rounds are dollar values at the time of snapshot ending.
ongoing: Ongoing
</i18n>
