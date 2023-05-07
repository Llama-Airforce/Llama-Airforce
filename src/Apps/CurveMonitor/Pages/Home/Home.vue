<template>
  <div class="home">
    <div class="controls-container">
      <InputText
        v-model="pool"
        class="search"
        placeholder="Search for a pool: enter a space here"
        :search="true"
      >
      </InputText>

      <!-- <Controls></Controls> -->
    </div>

    <div class="data">
      <KPIs></KPIs>
      <Chart></Chart>
    </div>

    <Card
      class="welcome"
      title="Welcome!"
    >
      <p>
        Introducing Curve Monitor, a user-friendly dashboard website created
        with Curve power users in mind. This platform is designed to help you
        easily access essential metrics and insights for your Curve usage,
        making your experience more enjoyable.
      </p>
      <p>
        With Curve Monitor, you'll find live pool metrics that can guide you in
        making well-informed decisions when interacting with Curve. You'll also
        find platform-wide statistics, such as platform revenue, which will
        provide you with a broader understanding of the overall health of the
        Curve ecosystem. Plus, we've added some handy DAO pages to keep you
        updated and informed.
      </p>
      <p>
        No matter your level of experience in the DeFi world, Curve Monitor is
        here to make things simpler and more accessible. So go ahead, give Curve
        Monitor a try and see how it can improve your experience with Curve.
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Card, InputText } from "@/Framework";
import KPIs from "@CM/Pages/Home/KPIs.vue";
import Chart from "@CM/Pages/Home/Chart.vue";

// Refs
const pool = ref("");
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);

  ::v-deep(.welcome) {
    .card-body {
      flex-direction: column;
    }
  }
}

.controls-container {
  box-shadow: var(--container-box-shadow);
  border-radius: var(--border-radius);
  overflow: hidden;

  ::v-deep(.search) {
    input {
      background: var(--c-lvl1);
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border: 0;
    }
  }
}

.data {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: var(--dashboard-gap);

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
