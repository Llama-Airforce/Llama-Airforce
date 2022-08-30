<template>
  <div class="revenue">
    <div class="title">Revenue</div>

    <div class="values">
      <div class="monthly">
        <span class="value">
          <AsyncValue
            :value="revenueMonthly"
            :precision="0"
            type="dollar"
          />
        </span>
        <span class="description">Average monthly revenue</span>
      </div>

      <div class="yearly">
        <span class="value">
          <AsyncValue
            :value="revenueAnnually"
            :precision="0"
            type="dollar"
          />
        </span>
        <span class="description">Annualized revenue</span>
      </div>
    </div>
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
const revenueMonthly = $computed((): number | undefined => {
  return model?.revenueMonthly;
});

const revenueAnnually = $computed((): number | undefined => {
  return model?.revenueAnnually;
});
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.revenue {
  display: flex;
  flex-direction: column;
  text-align: center;

  .title {
    color: $red;
    font-weight: normal;
  }

  .values {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: $border-size;
    background-color: $green;

    > div {
      background-color: $background-color;
      padding: 1rem 0;
    }

    .monthly {
      display: flex;
      flex-direction: column;

      .value {
        color: $blue;
      }
    }

    .yearly {
      display: flex;
      flex-direction: column;

      .value {
        color: $yellow;
      }
    }
  }
}
</style>
