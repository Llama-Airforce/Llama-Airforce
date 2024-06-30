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
        value="Swap"
        :primary="true"
        @click="showSwap = true"
      ></Button>
    </div>

    <ModalSwap
      :show="showSwap"
      @close="showSwap = false"
    ></ModalSwap>
  </Card>
</template>

<script setup lang="ts">
import ModalSwap from "@LAF/Pages/Pirex/Components/ModalSwap.vue";

const showSwap = ref(false);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
