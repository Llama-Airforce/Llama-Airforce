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
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { orderBy, reverse } from "lodash";
import { AsyncValue, KPI, Select } from "@/Framework";
import { countdown } from "@/Util";
import type { Epoch, Product } from "@/Pages/Bribes/Models";
import { useBribesStore } from "@/Pages/Bribes/Store";
import {
  dollarPerVlAsset as dollarPerVlAssetFunc,
  totalAmountDollars as totalAmountDollarsFunc,
} from "@/Pages/Bribes/Util/EpochHelper";
import { getDate, getDateRaw, getLink } from "@/Pages/Bribes/Util/EpochHelper";
import { vlAssetSymbol } from "@/Pages/Bribes/Util/ProtocolHelper";

const { t } = useI18n();

// Emits
const emit = defineEmits<{
  (e: "select-round", round: number): void;
}>();

// Refs
const store = useBribesStore();

let roundOpen = $ref(false);
let roundSelected = $ref(false);

let countdownString = $ref("");
let countdownTimer: ReturnType<typeof setTimeout>;

const epoch = $computed((): Epoch | null => {
  return store.selectedEpoch;
});

const product = $computed((): Product | null => {
  const platform = store.selectedPlatform;
  const protocol = store.selectedProtocol;

  if (!platform || !protocol) return null;

  return {
    platform,
    protocol,
  };
});

const rounds = $computed((): number[] => {
  if (!product) {
    return [];
  }

  const { platform, protocol } = product;

  return platform && protocol
    ? reverse(orderBy(store.rounds[platform][protocol]))
    : [];
});

const voteLink = $computed((): string => {
  return epoch ? getLink(epoch, epoch.proposal) : "";
});

const dollarPerVlAsset = $computed((): number | undefined => {
  return epoch ? dollarPerVlAssetFunc(epoch) : undefined;
});

const totalAmountDollars = $computed((): number | undefined => {
  return epoch ? totalAmountDollarsFunc(epoch) : undefined;
});

const date = $computed((): string => {
  return epoch ? getDate(epoch) : "";
});

const isFinished = $computed((): boolean => {
  return epoch ? new Date().getTime() > getDateRaw(epoch).getTime() : false;
});

// Watches
watch(
  () => epoch,
  (newEpoch): void => {
    clearInterval(countdownTimer);

    if (newEpoch) {
      countdownTimer = setInterval(() => {
        countdownString = countdown(getDateRaw(newEpoch));
      });
    }
  }
);

// Events
const onRoundOpen = (): void => {
  if (roundSelected) {
    roundSelected = false;
    return;
  }

  roundOpen = !roundOpen;
};

const onRoundSelect = (option: unknown): void => {
  const round = option as number;

  roundOpen = false;
  roundSelected = true;
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
    grid-template-columns: 1fr 1fr;

    > .round {
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
