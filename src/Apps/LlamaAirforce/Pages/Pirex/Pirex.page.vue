<script setup lang="ts">
import { useUnionStore } from "@Pounders/Store";
import UnionService from "@LAF/Services/UnionService";
import { PriceService } from "@/Services";
import FlyerService from "@/Services/FlyerService";
import { useClaim } from "@Pounders/Composables/UseClaim";
import { create as createPounderState } from "@Pounders/Models/PounderState";
import { createCvxPounder } from "@Pounders/Factories";
import { uCvxDepositZaps, uCvxWithdrawZaps } from "@Pounders/Zaps";
import type { ZapsFactories } from "@Pounders/Models";
import PounderComponent from "@Pounders/Components/Pounder.vue";

import VaultInfo from "./Components/VaultInfo.vue";
import UserInfo from "./Components/UserInfo.vue";

import RedemptionsInit from "./Components/RedemptionsInit.vue";
import Swap from "./Components/Swap.vue";

const unionService = new UnionService(useHost());
const priceService = new PriceService(useHost());
const flyerService = new FlyerService(useHost());

const { isConnected, address } = useAccount();

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
  const pounder = createCvxPounder(config, priceService, flyerService);

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
    <Card class="announcement border-flash">
      <div class="announcement-body">
        <h1>
          If your future rewards aren't showing up, you can claim them manually
          here
        </h1>

        <span>
          <router-link to="/pirex/futures"> Claim Futures </router-link>
        </span>
      </div>
    </Card>

    <PounderComponent
      v-if="store.pounders.ucvx"
      style="grid-area: pounder"
      pounder-id="ucvx"
    />

    <div
      style="grid-area: left"
      class="col"
    >
      <VaultInfo />
      <UserInfo v-if="isConnected" />
    </div>

    <div
      style="grid-area: right"
      class="col"
    >
      <RedemptionsInit />
      <Swap />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;

  grid-template-areas:
    "announcement announcement"
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

.announcement {
  grid-area: announcement;

  --flash-color: var(--c-yellow);

  .announcement-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1ch;

    h1 {
      margin: 0;
      font-size: 1rem;
    }

    span {
      display: flex;
      justify-content: end;
    }
  }
}
</style>
