<script setup lang="ts">
import { type FlyerConvex } from "@/Services/FlyerService";

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const bribesIncomeAnnually = computed((): number | undefined => {
  return model?.bribesIncomeAnnually;
});

const bribesIncomeBiWeekly = computed((): number | undefined => {
  return model?.bribesIncomeBiWeekly;
});
</script>

<template>
  <div class="bribes">
    <div class="title">Incentives</div>
    <ul>
      <li>
        CVX acts as a union controlling CRV rewards for Curve LP pools. To
        receive rewards, incentives must be paid to locked CVX holders.
      </li>

      <li>
        CVX holders will potentially earn over
        <AsyncValue
          :value="bribesIncomeAnnually"
          :precision="0"
          type="dollar"
        />
        in incentives over a 1 year period.
      </li>

      <li>
        Incentives to CVX holders are very likely to reach
        <AsyncValue
          :value="bribesIncomeBiWeekly"
          :precision="0"
          type="dollar"
        />
        biweekly in the coming weeks (based on total rewards paid by Votium app)
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.bribes {
  display: flex;
  flex-direction: column;

  ul {
    li {
      background: url("@/Assets/Flyer/triangle.png") no-repeat left center;
      padding-left: 3rem;
      margin: 1rem 0;
      min-height: 1.75rem;
    }
  }

  .title {
    color: var(--c-green);
  }
}
</style>
