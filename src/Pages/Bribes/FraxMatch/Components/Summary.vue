<template>
  <div class="summary">
    <KPI
      label="Total"
      :has-value="true"
    >
      <AsyncValue
        :value="500"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      label="Match Ratio"
      :has-value="true"
    >
      <AsyncValue
        :value="69"
        :precision="0"
        type="percentage"
      />
    </KPI>
  </div>
</template>

<script
  setup
  lang="ts"
>
import AsyncValue from "@/Framework/AsyncValue.vue";
import KPI from "@/Framework/KPI.vue";
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;
}
</style>
