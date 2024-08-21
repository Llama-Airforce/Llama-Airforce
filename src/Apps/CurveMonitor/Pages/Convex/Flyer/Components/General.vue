<script setup lang="ts">
import { type FlyerConvex } from "@/Services/FlyerService";

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

<template>
  <div class="general">
    <div class="title">Total locked value, incentives &amp; market cap</div>
    <ul>
      <li>
        <AsyncValue
          :value="crvLockedDollars"
          :precision="0"
          type="dollar"
        />
        worth of CRV permanently locked in its contract, and is continuing to
        see a rate of about
        <AsyncValue
          :value="crvLockedDollarsMonthly"
          :precision="0"
          type="dollar"
        />
        worth of CRV permanently locked in its contract per month.
      </li>
      Convex currently has about
      <li>
        <AsyncValue
          :value="cvxTvl"
          :precision="0"
          type="dollar"
        />
        TVL and controls close to
        <AsyncValue
          :value="cvxVotingPercentage"
          :precision="0"
          type="percentage"
        />
        of the voting power of Curve.
      </li>
      <li>
        Convex's market cap is just
        <AsyncValue
          :value="cvxMarketCap"
          :precision="0"
          type="dollar"
        />
        with a fully diluted valuation of
        <AsyncValue
          :value="cvxMarketCapFullyDiluted"
          :precision="0"
          type="dollar"
        />.
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.general {
  display: flex;
  flex-direction: column;

  ul {
    li {
      background: url("@/Assets/Flyer/star.png") no-repeat left center;
      padding-left: 3rem;
      margin: 1rem 0;
      min-height: 1.75rem;
    }
  }

  .title {
    color: var(--c-purple);
  }
}
</style>
