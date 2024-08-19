<script setup lang="ts"></script>

<template>
  <div class="fees">
    <KPI
      tooltip-type="icon"
      label="Bribe Fee"
      tooltip="Fee accessed on bribes earned from vlCVX"
    >
      <AsyncValue
        :value="4"
        type="percentage"
      ></AsyncValue>
    </KPI>

    <KPI
      tooltip-type="icon"
      label="Redemption Fee"
      tooltip="Linearly scales with time depending on redemption time. Can be avoided swapping through curve pool depending on slippage"
    >
      <AsyncValue
        :value="5"
        type="percentage"
      >
      </AsyncValue>
    </KPI>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.fees {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  justify-items: center;

  > * {
    min-width: 150px;
  }
}
</style>
