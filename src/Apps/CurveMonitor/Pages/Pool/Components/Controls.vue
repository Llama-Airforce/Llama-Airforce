<template>
  <div class="controls">
    <div class="gutter"></div>
    <div class="rows">
      <div class="title">Charts</div>
      <div class="items">
        <SelectorPair></SelectorPair>
        <SelectorRange></SelectorRange>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectorPair from "@CM/Components/SelectorPair.vue";
import SelectorRange from "@CM/Components/SelectorRange.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.controls {
  display: flex;
  flex-grow: 1;
  gap: 1.25rem;

  > .gutter {
    width: 0.5rem;
    background-color: var(--gutter-color);

    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  > .rows {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    gap: var(--dashboard-gap);
    margin: 0.5rem 0rem;

    > .title {
      color: var(--c-lvl6);
      font-size: 1.5rem;
      font-weight: 700;
      gap: 1rem;
    }

    > .items {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;

      @media only screen and (max-width: 1280px) {
        flex-direction: column;
        gap: 1rem;
      }
    }
  }
}
</style>
