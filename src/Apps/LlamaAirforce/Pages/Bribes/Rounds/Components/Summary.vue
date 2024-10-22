<script setup lang="ts">
import { type Epoch } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import {
  dollarPerVlAsset as dollarPerVlAssetFunc,
  totalAmountDollars as totalAmountDollarsFunc,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import {
  getDate,
  getDateRaw,
  getLink,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@LAF/Pages/Bribes/Util/ProtocolHelper";

const { t } = useI18n();

const { rounds = [], epoch } = defineProps<{
  rounds: number[];
  epoch?: Epoch;
}>();

const emit = defineEmits<{
  "select-round": [round: number];
}>();

// Refs
let countdownTimer: ReturnType<typeof setTimeout>;

const { product } = storeToRefs(useBribesStore());

const countdownString = ref("");
const roundsOrdered = computed(() => rounds.orderBy((x) => x, "desc"));
const voteLink = computed(() => (epoch ? getLink(epoch, epoch.proposal) : ""));

const dollarPerVlAsset = computed(() =>
  epoch ? dollarPerVlAssetFunc(epoch) : undefined
);

const totalAmountDollars = computed(() =>
  epoch ? totalAmountDollarsFunc(epoch) : undefined
);

const date = computed(() => (epoch ? getDate(epoch) : ""));

const isFinished = computed(() =>
  epoch ? new Date().getTime() > getDateRaw(epoch).getTime() : false
);

// Watches
watch(
  () => epoch,
  (epoch): void => {
    clearInterval(countdownTimer);

    if (epoch) {
      countdownTimer = setInterval(() => {
        countdownString.value = countdown(getDateRaw(epoch));
      });
    }
  }
);

// Select
const onRoundSelect = (round: number): void => {
  emit("select-round", round);
};
</script>

<template>
  <div class="summary">
    <Select
      v-if="epoch"
      class="select-round"
      :label="t('round-number')"
      :options="roundsOrdered"
      :selected="epoch.round"
      @input="onRoundSelect"
    >
      <template #item="{ item }">
        <div class="item">{{ item }}</div>
      </template>
    </Select>

    <KPI v-else />

    <KPI
      :label="'$/' + vlAssetSymbol(product?.protocol)"
      :has-value="!!dollarPerVlAsset"
    >
      <AsyncValue
        type="dollar"
        :value="dollarPerVlAsset"
        :precision="5"
      />
    </KPI>

    <KPI
      :label="t('deadline')"
      :value="date"
      :has-value="!!date"
    >
      <template #label-second>
        <a
          class="vote-link"
          target="_blank"
          :href="voteLink"
        >
          <span v-if="isFinished">{{ t("voting-ended") }}</span>
          <span v-else>
            <LucideClock style="vertical-align: top" />
            {{ countdownString }}
          </span>
        </a>
      </template>
    </KPI>

    <KPI
      label="Total"
      :has-value="!!totalAmountDollars"
    >
      <AsyncValue
        type="dollar"
        :value="totalAmountDollars"
        :precision="2"
      />
    </KPI>
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1.5rem;

  @media only screen and (max-width: 1280px) {
    grid-template-columns: 1fr 1fr 1fr;

    > .select-round {
      grid-row: 1;
      grid-column: 1 / span 3;
    }
  }

  .item {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .vote-link {
    font-size: 0.75rem;

    .lucide {
      width: 0.75rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
round-number: Round Number
deadline: Deadline
voting-ended: Voting Ended
</i18n>
