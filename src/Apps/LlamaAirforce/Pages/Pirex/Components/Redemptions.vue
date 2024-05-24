<template>
  <Card title="Redemptions">
    <div class="redemptions-body">
      <div class="info">
        Burn pxCVX to initiate a withdrawal of CVX from the protocol. Rewards
        can still be claimed until redemption date.
      </div>

      <a
        href="https://docs.redacted.finance/products/pirex/pxcvx/upxcvx-unlocking"
        target="_blank"
      >
        Learn More
      </a>

      <Button
        value="Initiate Redemption"
        :primary="true"
      ></Button>
    </div>
  </Card>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-body {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  a {
    align-self: flex-start;
  }

  button {
    justify-content: center;
  }
}
</style>
