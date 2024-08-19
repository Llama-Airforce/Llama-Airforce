<script setup lang="ts"></script>

<template>
  <div class="strategy">
    <div class="info">
      The vault locks the user's CVX in Convex to receive vlCVX in 16 week
      intervals. The vlCVX then receives optimal bribe rewards from an
      integration with Votium which can be claimed by the holders of pxCVX.
    </div>

    <div class="links">
      <a
        href="https://docs.redacted.finance/products/pirex/convex/pxcvx-standard-mode"
        target="_blank"
      >
        Learn More
      </a>

      <a
        href="https://etherscan.io/address/0x35A398425d9f1029021A92bc3d2557D42C8588D7"
        target="_blank"
      >
        Etherscan
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.strategy {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  .links {
    display: flex;
    gap: var(--dashboard-gap);
  }
}
</style>
