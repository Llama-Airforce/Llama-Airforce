<template>
  <div class="bribes">
    <div class="title">{{ t("incentives") }}</div>
    <ul>
      <li>{{ t("description") }}</li>
      <li>
        {{ t("annual-1") }}
        <AsyncValue
          :value="bribesIncomeAnnually"
          :precision="0"
          type="dollar"
        />
        {{ t("annual-2") }}
      </li>
      <li>
        {{ t("biweek-1") }}
        <AsyncValue
          :value="bribesIncomeBiWeekly"
          :precision="0"
          type="dollar"
        />
        {{ t("biweek-2") }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { type FlyerConvex } from "@/Services/FlyerService";

const { t } = useI18n();

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

<i18n lang="yaml" locale="en">
incentives: Incentives
description: CVX acts as a union controlling CRV rewards for Curve LP pools. To
  receive rewards, incentives must be paid to locked CVX holders.

annual-1: CVX holders will potentially earn over
annual-2: in incentives over a 1 year period.

biweek-1: Incentives to CVX holders are very likely to reach
biweek-2: biweekly in the coming weeks (based on total rewards paid by Votium app)
</i18n>
