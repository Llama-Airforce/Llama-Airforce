<template>
  <div class="flyer">
    <div class="flyer-items">
      <Header></Header>
      <Farm :model="model"></Farm>
      <General :model="model"></General>
      <Bribes :model="model"></Bribes>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getHost } from "@/Services/Host";
import Header from "@LAF/Pages/Convex/Flyer/Components/Header.vue";
import General from "@LAF/Pages/Convex/Flyer/Components/General.vue";
import Bribes from "@LAF/Pages/Convex/Flyer/Components/Bribes.vue";
import Farm from "@LAF/Pages/Convex/Flyer/Components/Farm.vue";
import FlyerService from "@LAF/Pages/Convex/Flyer/Services/FlyerService";
import { type FlyerConvex } from "@LAF/Pages/Convex/Flyer/Models/FlyerConvex";

const flyerService = new FlyerService(getHost());

// Refs
const model = ref<FlyerConvex | null>(null);

onMounted(async (): Promise<void> => {
  const resp = await minDelay(flyerService.getConvex());

  if (resp.success && resp.dashboard) {
    model.value = resp.dashboard;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.flyer {
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: var(--font-weight);

  .flyer-items {
    display: flex;
    flex-direction: column;
    width: 750px;

    @media only screen and (max-width: 1280px) {
      width: 100%;
      padding: 2rem;
    }

    // Each direct item should be as wide as possible.
    > div {
      width: 100%;
    }

    // Add a line seperator between two divs.
    > div + div,
    > div:first-child {
      padding-bottom: 2rem;
      margin-bottom: 2rem;
      border-bottom: $border-size solid var(--c-yellow);
    }

    // Except for the last div, ofcourse.
    > div:last-child {
      border-bottom: 0;
    }

    // Shared styles for underlying components.
    ::v-deep(.title) {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;

      font-size: 1.8rem;
      text-align: center;
      text-transform: uppercase;
    }

    ::v-deep(.values) {
      .value {
        font-size: 4.8rem;
      }

      .description {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        font-size: 1.5rem;
        margin: 0 1rem;
      }
    }

    ::v-deep(ul) {
      display: flex;
      flex-direction: column;
      padding: 0;
      margin: 0;
      list-style: none;

      // Vertically center text in list items.
      li {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
