<template>
  <div class="summary">
    <Select
      class="select-summary"
      :label="t('round-number')"
      :options="rounds"
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
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { orderBy, reverse } from "lodash";
import { AsyncValue, KPI, Select } from "@/Framework";
import { countdown } from "@/Util";
import type { Epoch, Product } from "@LAF/Pages/Bribes/Models";
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

// Emits
const emit = defineEmits<{
  "select-round": [round: number];
}>();

// Refs
const store = useBribesStore();

const roundOpen = ref(false);
const roundSelected = ref(false);
const countdownString = ref("");

const epoch = computed((): Epoch | null => {
  return store.selectedEpoch;
});

const product = computed((): Product | null => {
  const platform = store.selectedPlatform;
  const protocol = store.selectedProtocol;

  if (!platform || !protocol) return null;

  return {
    platform,
    protocol,
  };
});

const rounds = computed((): number[] => {
  if (!product.value) {
    return [];
  }

  const { platform, protocol } = product.value;

  return platform && protocol
    ? reverse(orderBy(store.rounds[platform][protocol]))
    : [];
});

const voteLink = computed((): string => {
  return epoch.value ? getLink(epoch.value, epoch.value.proposal) : "";
});

const dollarPerVlAsset = computed((): number | undefined => {
  return epoch.value ? dollarPerVlAssetFunc(epoch.value) : undefined;
});

const totalAmountDollars = computed((): number | undefined => {
  return epoch.value ? totalAmountDollarsFunc(epoch.value) : undefined;
});

const date = computed((): string => {
  return epoch.value ? getDate(epoch.value) : "";
});

const isFinished = computed((): boolean => {
  return epoch.value
    ? new Date().getTime() > getDateRaw(epoch.value).getTime()
    : false;
});

// Watches
watch(epoch, (newEpoch): void => {
  clearInterval(countdownTimer);

  if (newEpoch) {
    countdownTimer = setInterval(() => {
      countdownString.value = countdown(getDateRaw(newEpoch));
    });
  }
});

// Events
const onRoundOpen = (): void => {
  if (roundSelected.value) {
    roundSelected.value = false;
    return;
  }

  roundOpen.value = !roundOpen.value;
};

const onRoundSelect = (option: unknown): void => {
  const round = option as number;

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

  ::v-deep(.select-summary) {
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
