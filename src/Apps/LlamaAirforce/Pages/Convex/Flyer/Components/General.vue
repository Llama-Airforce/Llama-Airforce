<template>
  <div class="general">
    <div
      class="title"
      v-html="t('description')"
    ></div>
    <ul>
      <li>
        <AsyncValue
          :value="crvLockedDollars"
          :precision="0"
          type="dollar"
        />
        {{ t("locked-1") }}
        <AsyncValue
          :value="crvLockedDollarsMonthly"
          :precision="0"
          type="dollar"
        />
        {{ t("locked-2") }}
      </li>
      <li>
        {{ t("locked-2") }}
        <AsyncValue
          :value="cvxTvl"
          :precision="0"
          type="dollar"
        />
        {{ t("locked-2") }}
        <AsyncValue
          :value="cvxVotingPercentage"
          :precision="0"
          type="percentage"
        />
        {{ t("locked-3") }}
      </li>
      <li>
        {{ t("mcap-1") }}
        <AsyncValue
          :value="cvxMarketCap"
          :precision="0"
          type="dollar"
        />
        {{ t("mcap-2") }}
        <AsyncValue
          :value="cvxMarketCapFullyDiluted"
          :precision="0"
          type="dollar"
        />.
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { AsyncValue } from "@/Framework";
import FlyerConvex from "@LAF/Pages/Convex/Flyer/Models/FlyerConvex";

const { t } = useI18n();

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const crvLockedDollars = computed((): number | undefined => {
  return model?.crvLockedDollars;
});

const crvLockedDollarsMonthly = computed((): number | undefined => {
  return model?.crvLockedDollarsMonthly;
});

const cvxTvl = computed((): number | undefined => {
  return model?.cvxTvl;
});

const cvxVotingPercentage = computed((): number | undefined => {
  return model?.cvxVotingPercentage;
});

const cvxMarketCap = computed((): number | undefined => {
  return model?.cvxMarketCap;
});

const cvxMarketCapFullyDiluted = computed((): number | undefined => {
  return model?.cvxMarketCapFullyDiluted;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.general {
  display: flex;
  flex-direction: column;

  ul {
    li {
      background: url("@/Assets/star.png") no-repeat left center;
      padding-left: 3rem;
      margin: 1rem 0;
      min-height: 1.75rem;
    }
  }

  .title {
    color: var(--c-purple);
    font-weight: normal;
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Total locked value, incentives &amp; market cap

locked-1: worth of CRV permanently locked in its contract, and is continuing to
  see a rate of about
locked-2: worth of CRV permanently locked in its contract per month.
locked-3: of the voting power of Curve.

tvl-1: Convex currently has about
tvl-2: TVL and controls close to
tvl-3: of the voting power of Curve.

mcap-1: Convex's market cap is just
mcap-2: with a fully diluted valuation of
</i18n>
