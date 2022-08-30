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
      <li>
        Convex currently has about
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

<script
  setup
  lang="ts"
>
import { $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import FlyerConvex from "@/Pages/Convex/Flyer/Models/FlyerConvex";

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const crvLockedDollars = $computed((): number | undefined => {
  return model?.crvLockedDollars;
});

const crvLockedDollarsMonthly = $computed((): number | undefined => {
  return model?.crvLockedDollarsMonthly;
});

const cvxTvl = $computed((): number | undefined => {
  return model?.cvxTvl;
});

const cvxVotingPercentage = $computed((): number | undefined => {
  return model?.cvxVotingPercentage;
});

const cvxMarketCap = $computed((): number | undefined => {
  return model?.cvxMarketCap;
});

const cvxMarketCapFullyDiluted = $computed((): number | undefined => {
  return model?.cvxMarketCapFullyDiluted;
});
</script>

<style
  lang="scss"
  scoped
>
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
    color: $purple;
    font-weight: normal;
  }
}
</style>
