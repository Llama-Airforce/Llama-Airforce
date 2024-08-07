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
import Header from "@CM/Pages/Convex/Flyer/Components/Header.vue";
import General from "@CM/Pages/Convex/Flyer/Components/General.vue";
import Bribes from "@CM/Pages/Convex/Flyer/Components/Bribes.vue";
import Farm from "@CM/Pages/Convex/Flyer/Components/Farm.vue";
import FlyerService, { type FlyerConvex } from "@/Services/FlyerService";

const flyerService = new FlyerService(useHost());

// Refs
const model = ref<FlyerConvex | null>(null);

onMounted(async (): Promise<void> => {
  const resp = await minDelay(flyerService.getConvex());

  if (resp.statusCode === 200 && resp.dashboard) {
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
    :deep(.title) {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;

      font-size: 1.8rem;
      text-align: center;
      text-transform: uppercase;
    }

    :deep(.values) {
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

    :deep(ul) {
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
