<script setup lang="ts">
import ModalRedemptionsInit from "./Components/ModalRedemptionsInit.vue";

const showRedemptionsInit = ref(false);
</script>

<template>
  <Card title="Redemptions">
    <div class="redemptions-init-body">
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
        class="primary"
        @click="showRedemptionsInit = true"
      >
        Initiate Redemption
      </Button>
    </div>

    <ModalRedemptionsInit
      :show="showRedemptionsInit"
      @close="showRedemptionsInit = false"
    />
  </Card>
</template>

<style scoped>
.redemptions-init-body {
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
