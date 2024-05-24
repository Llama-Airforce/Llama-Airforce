<template>
  <div class="pirex">
    <div class="dashboard">
      <div
        style="grid-area: left"
        class="col"
      >
        <VaultInfo></VaultInfo>
        <UserInfo v-if="connected"></UserInfo>
      </div>

      <div
        style="grid-area: right"
        class="col"
      >
        <Redemptions></Redemptions>
        <Swap></Swap>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";
import VaultInfo from "@LAF/Pages/Pirex/Components/VaultInfo.vue";
import UserInfo from "@LAF/Pages/Pirex/Components/UserInfo.vue";

import Redemptions from "@LAF/Pages/Pirex/Components/Redemptions.vue";
import Swap from "@LAF/Pages/Pirex/Components/Swap.vue";

const { connected } = useWallet();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("pirex");

.pirex {
  .dashboard {
    display: grid;
    grid-template-columns: 2fr 1fr;

    grid-template-areas: "left right";

    .col {
      display: flex;
      flex-direction: column;
      gap: var(--dashboard-gap);

      > * {
        flex-grow: 0;
      }
    }
  }
}
</style>
