<script setup lang="ts">
import ModalSwap from "./ModalSwap.vue";

const showSwap = ref(false);
</script>

<template>
  <Card title="Swap">
    <div class="swap-body">
      <div class="info">
        Swap <strong>pxCVX</strong> for <strong>CVX</strong> or vice versa
        though the curve pool.
      </div>

      <a
        href="https://docs.redacted.finance/products/pirex/convex/pxcvx-cvx-lp"
        target="_blank"
      >
        Learn More
      </a>

      <Button
        class="primary"
        @click="showSwap = true"
      >
        Swap
      </Button>
    </div>

    <ModalSwap
      :show="showSwap"
      @close="showSwap = false"
    />
  </Card>
</template>

<style scoped>
.swap-body {
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
