<script setup lang="ts">
import { useWallet } from "@/Wallet";

import { useUnionStore } from "@Pounders/Store";
import UnionService from "@LAF/Services/UnionService";
import { DefiLlamaService } from "@/Services";
import FlyerService from "@/Services/FlyerService";
import { useClaim } from "@Pounders/Composables/UseClaim";
import { create as createPounderState } from "@Pounders/Models/PounderState";
import { createCvxPounder } from "@Pounders/Factories";
import { uCvxDepositZaps, uCvxWithdrawZaps } from "@Pounders/Zaps";
import type { ZapsFactories } from "@Pounders/Models";
import PounderComponent from "@Pounders/Components/Pounder.vue";

import VaultInfo from "@LAF/Pages/Pirex/Components/VaultInfo.vue";
import UserInfo from "@LAF/Pages/Pirex/Components/UserInfo.vue";

import RedemptionsInit from "@LAF/Pages/Pirex/Components/RedemptionsInit.vue";
import Swap from "@LAF/Pages/Pirex/Components/Swap.vue";

const unionService = new UnionService(useHost());
const llamaService = new DefiLlamaService();
const flyerService = new FlyerService(useHost());

const { isConnected, address } = useWallet();

const store = useUnionStore();

// uCVX claim
const { claim: claimUCvx } = useClaim(unionService, "ucvx", address, true);
watch(claimUCvx, (claimUCvx) => (store.claims.ucvx = claimUCvx ?? undefined), {
  immediate: true,
});

// uCVX pounder
watch(address, createUCvxPounder);
onMounted(createUCvxPounder);

const config = useConfig();
function createUCvxPounder() {
  const pounder = createCvxPounder(config, llamaService, flyerService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      uCvxDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      uCvxWithdrawZaps(
        () => config,
        () => address.value,
        getInput
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
  };
  store.updateClaim(pounder.id, claimUCvx.value ?? undefined);
}
</script>

<template>
  <div class="dashboard">
    <PounderComponent
      v-if="store.pounders.ucvx"
      style="grid-area: pounder"
      pounder-id="ucvx"
    ></PounderComponent>

    <div
      style="grid-area: left"
      class="col"
    >
      <VaultInfo></VaultInfo>
      <UserInfo v-if="isConnected"></UserInfo>
    </div>

    <div
      style="grid-area: right"
      class="col"
    >
      <RedemptionsInit></RedemptionsInit>
      <Swap></Swap>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;

  grid-template-areas:
    "pounder pounder"
    "left right";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    > * {
      flex-grow: 0;
    }
  }
}
</style>
