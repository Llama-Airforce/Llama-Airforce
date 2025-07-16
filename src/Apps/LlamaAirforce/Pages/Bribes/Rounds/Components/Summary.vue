<script setup lang="ts">
import type { Epoch } from "../../Models";
import { useBribesStore } from "../../Store";
import {
  dollarPerVlAsset,
  totalAmountDollars,
  totalAmountBribed,
  getDate,
  getDateRaw,
  getLink,
} from "../../Util/EpochHelper";
import { vlAssetSymbol } from "../../Util/ProtocolHelper";

const { t } = useI18n();

const { rounds, epoch } = defineProps<{
  rounds: number[];
  epoch?: Epoch;
}>();

const emit = defineEmits<{
  "select-round": [round: number];
}>();

let countdownTimer: ReturnType<typeof setTimeout>;

const { product } = storeToRefs(useBribesStore());

const countdownString = ref("");
const roundsOrdered = computed(() => rounds.orderBy((x) => x, "desc"));
const voteLink = computed(() => (epoch ? getLink(epoch, epoch.proposal) : ""));
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
      :label="t('round-number')"
      :options="roundsOrdered"
      :selected="epoch.round"
      @select="onRoundSelect"
    >
      <template #option="{ option }">
        <div class="option">{{ option }}</div>
      </template>
    </Select>

    <KPI v-else />

    <KPI
      :label="t('votes')"
      :has-value="!!epoch"
    >
      <AsyncValue
        type="dollar"
        :value="epoch ? totalAmountBribed(epoch) : undefined"
        :precision="2"
        :show-symbol="false"
      />
      CVX
    </KPI>

    <KPI
      :label="t('total')"
      :has-value="!!epoch"
    >
      <AsyncValue
        type="dollar"
        :value="epoch ? totalAmountDollars(epoch) : undefined"
        :precision="2"
      />
    </KPI>

    <KPI
      :label="'$/' + vlAssetSymbol(product?.protocol)"
      :has-value="!!epoch"
    >
      <AsyncValue
        type="dollar"
        :value="epoch ? dollarPerVlAsset(epoch) : undefined"
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
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.5rem;

  .option {
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

<i18n lang="yaml">
en:
  round-number: Round Number
  deadline: Deadline
  voting-ended: Voting Ended
  total: Total
  votes: Votes
fr:
  round-number: Numéro de tour
  deadline: Date limite
  voting-ended: Vote terminé
  total: Total
  votes: Votes
zh:
  round-number: 轮次编号
  deadline: 截止日期
  voting-ended: 投票结束
  total: 总计
  votes: 投票
</i18n>
