<script setup lang="ts"></script>

<template>
  <div class="fees">
    <KPI
      tooltip-type="icon"
      label="Bribe Fee"
      tooltip="Fee accessed on bribes earned from vlCVX"
    >
      <AsyncValue
        type="percentage"
        :value="4"
      />
    </KPI>

    <KPI
      tooltip-type="icon"
      label="Redemption Fee"
      tooltip="Linearly scales with time depending on redemption time. Can be avoided swapping through curve pool depending on slippage"
    >
      <AsyncValue
        type="percentage"
        :value="5"
      />
    </KPI>
  </div>
</template>

<style scoped>
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
