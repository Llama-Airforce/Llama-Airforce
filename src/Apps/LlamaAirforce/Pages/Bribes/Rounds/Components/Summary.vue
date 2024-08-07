<template>
  <div class="summary">
    <Select
      class="select-summary"
      :label="t('round-number')"
      :options="roundsOrdered"
      :selected="epoch?.round"
      :open="roundOpen"
      @open="onRoundOpen"
      @close="roundOpen = false"
      @input="onRoundSelect"
    ></Select>

    <KPI
      :label="'$/' + vlAssetSymbol(product?.protocol)"
      :has-value="!!dollarPerVlAsset"
    >
      <AsyncValue
        :value="dollarPerVlAsset"
        :precision="5"
        type="dollar"
      />
    </KPI>

    <KPI
      :label="t('deadline')"
      :value="date"
      :has-value="!!date"
    >
      <template #label-second>
        <a
          :href="voteLink"
          target="_blank"
          class="vote-link"
        >
          <span v-if="isFinished">{{ t("voting-ended") }}</span>
          <span v-else><i class="far fa-clock"></i> {{ countdownString }}</span>
        </a>
      </template>
    </KPI>

    <KPI
      label="Total"
      :has-value="!!totalAmountDollars"
    >
      <AsyncValue
        :value="totalAmountDollars"
        :precision="2"
        type="dollar"
      />
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { orderBy, reverse } from "lodash";
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

let countdownTimer: ReturnType<typeof setTimeout>;

// Props
interface Props {
  rounds: number[];
  epoch?: Epoch;
}

const { rounds = [], epoch } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "select-round": [round: number];
}>();

// Refs
const { product } = storeToRefs(useBribesStore());

const roundOpen = ref(false);
const roundSelected = ref(false);
const countdownString = ref("");

const roundsOrdered = computed((): number[] => reverse(orderBy(rounds)));

const voteLink = computed((): string =>
  epoch ? getLink(epoch, epoch.proposal) : ""
);

const dollarPerVlAsset = computed((): number | undefined =>
  epoch ? dollarPerVlAssetFunc(epoch) : undefined
);

const totalAmountDollars = computed((): number | undefined =>
  epoch ? totalAmountDollarsFunc(epoch) : undefined
);

const date = computed((): string => (epoch ? getDate(epoch) : ""));

const isFinished = computed((): boolean =>
  epoch ? new Date().getTime() > getDateRaw(epoch).getTime() : false
);

// Watches
watch(
  () => epoch,
  (newEpoch): void => {
    clearInterval(countdownTimer);

    if (newEpoch) {
      countdownTimer = setInterval(() => {
        countdownString.value = countdown(getDateRaw(newEpoch));
      });
    }
  }
);

// Events
const onRoundOpen = (): void => {
  if (roundSelected.value) {
    roundSelected.value = false;
    return;
  }

  roundOpen.value = !roundOpen.value;
};

const onRoundSelect = (round: number): void => {
  roundOpen.value = false;
  roundSelected.value = true;
  emit("select-round", round);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;

  @media only screen and (max-width: 1280px) {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr 1fr 1fr;

    > .select-summary {
      grid-row: 1;
      grid-column: 1 / span 3;
    }
  }

  :deep(.select-summary) {
    flex-grow: 1;
    flex-basis: 0;

    .select {
      > .selected > .item,
      > .items {
        font-size: 1.25rem;
        font-weight: 700;
      }

      > .items {
        margin-top: 3.75rem;
        line-height: 1.75rem;
      }
    }
  }

  .vote-link {
    font-size: 0.75rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
round-number: Round Number
deadline: Deadline
voting-ended: Voting Ended
</i18n>
