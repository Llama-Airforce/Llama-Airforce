<template>
  <div class="quorum">
    <div class="heading">{{ t("quorum") }}</div>
    <div class="amount">7102 / 23674 veCRV</div>

    <div class="bar">
      <div
        class="support"
        :style="{ width: `${(support / quorum) * 100}%` }"
      ></div>

      <div
        class="quorum"
        :style="{ width: `${100 - (support / quorum) * 100}%` }"
      ></div>
    </div>

    <div class="percentages">
      <div class="zero">0%</div>
      <div class="quorum">30%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import type { Results } from "@/Pages/Curve/DAO/Proposals/Models/Results";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
  results: Results;
}

const { results } = defineProps<Props>();

// Methods
const support = $computed((): number => {
  return 10;
});

const quorum = $computed((): number => {
  return 30;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.quorum {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  > .heading {
    color: #a1a1aa;
    font-size: 1.125rem;
  }

  > .label {
    display: flex;
    font-weight: bold;
  }

  > .amount {
    display: flex;
    font-size: 0.875rem;
  }

  > .bar {
    display: flex;
    height: 0.5rem;

    > .support {
      background-color: rgb(126, 217, 87);
    }

    > .quorum {
      background-color: rgb(255, 87, 87);
    }
  }

  > .percentages {
    display: flex;
    justify-content: space-between;

    font-size: 0.6rem;

    > .zero {
      text-align: start;
    }

    > .quorum {
      text-align: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
quorum: Quorum
</i18n>
