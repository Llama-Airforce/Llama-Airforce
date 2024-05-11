<template>
  <div class="revenue">
    <div class="title">{{ t("revenue") }}</div>

    <div class="values">
      <div class="monthly">
        <span class="value">
          <AsyncValue
            :value="revenueMonthly"
            :precision="0"
            type="dollar"
          />
        </span>
        <span class="description">{{ t("revenue-monthly") }}</span>
      </div>

      <div class="yearly">
        <span class="value">
          <AsyncValue
            :value="revenueAnnually"
            :precision="0"
            type="dollar"
          />
        </span>
        <span class="description">{{ t("revenue-annually") }}</span>
      </div>
    </div>
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
const revenueMonthly = computed((): number | undefined => {
  return model?.revenueMonthly;
});

const revenueAnnually = computed((): number | undefined => {
  return model?.revenueAnnually;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.revenue {
  display: flex;
  flex-direction: column;
  text-align: center;

  .title {
    color: var(--c-red);
    font-weight: normal;
  }

  .values {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: $border-size;
    background-color: var(--c-green);

    > div {
      background-color: var(--c-lvl0);
      padding: 1rem 0;
    }

    .monthly {
      display: flex;
      flex-direction: column;

      .value {
        color: var(--c-blue);
      }
    }

    .yearly {
      display: flex;
      flex-direction: column;

      .value {
        color: var(--c-yellow);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
revenue: Revenue
revenue-monthly: Average monthly revenue
revenue-annually: Annualized revenue
</i18n>
