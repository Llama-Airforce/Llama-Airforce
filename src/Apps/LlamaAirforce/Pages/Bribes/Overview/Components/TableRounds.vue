<template>
  <DataTable
    class="datatable-bribe-rounds"
    :rows="epochs"
    :columns="['', t('deadline'), `$/${vlAssetSymbol(protocol)}`, t('total')]"
    :sorting="true"
    :sorting-columns="sortColumns"
    :sorting-columns-enabled="sortColumnsNoEmpty"
    sorting-default-column="deadline"
    sorting-default-dir="desc"
    @sort-column="onSort"
    @selected="onSelected"
  >
    <template #header-content>
      <div class="title">{{ t("all-rounds") }}</div>
      <Tooltip>{{ t("tooltip") }}</Tooltip>
    </template>

    <template #row="props: { item: EpochOverview }">
      <div
        class="round-number"
        @click.stop
      >
        <a
          :href="voteLink(props.item)"
          target="_blank"
          class="vote-link"
        >
          <span v-if="isFinished(props.item)">{{ round(props.item) }}</span>
          <span v-else>
            <Tooltip icon="far fa-clock">{{ t("ongoing") }}</Tooltip>
          </span>
        </a>
      </div>
      <div>
        {{ date(props.item) }}
      </div>
      <div class="number">
        <AsyncValue
          :value="dollarPerVlAsset(props.item)"
          :precision="5"
          type="dollar"
        />
      </div>
      <div class="number">
        <AsyncValue
          :value="totalAmountDollars(props.item)"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { orderBy } from "lodash";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import {
  getDate,
  getDateRaw,
  getLink,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";
import type { EpochOverview, Overview } from "@LAF/Pages/Bribes/Models";

const { t } = useI18n();

// Props
interface Props {
  overview?: Overview;
}

const { overview } = defineProps<Props>();

// Refs
const { protocol } = storeToRefs(useBribesStore());

const router = useRouter();

const { sortColumns, sortColumnsNoEmpty, sortColumn, sortOrder, onSort } =
  useSort(["", "deadline", "vlasset", "total"], "deadline");

const epochs = computed((): EpochOverview[] => {
  return orderBy(
    overview?.epochs ?? [],
    (epoch: EpochOverview) => {
      switch (sortColumn.value) {
        case "deadline":
          return epoch.round;
        case "vlasset":
          return dollarPerVlAsset(epoch);
        case "total":
          return totalAmountDollars(epoch);
        default:
          return epoch.round;
      }
    },
    sortOrder.value
  );
});

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-bribe-rounds {
  --columns-header: 1fr auto;
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
    }

    // Fix text in tooltip having link color.
    .popper {
      color: var(--c-text);
    }
  }

  :deep(.row-data) {
    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
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
