<script setup lang="ts">
import { useWallet } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import UnionService from "@LAF/Services/UnionService";
import Documentation from "@LAF/Components/Documentation.vue";
import Migrations from "@Pounders/Components/Migrations/Migrations.vue";
import PounderComponent from "@Pounders/Components/Pounder.vue";
import { useUnionStore } from "@Pounders/Store";
import type { ZapsFactories } from "@Pounders/Models";
import { create as createPounderState } from "@Pounders/Models/PounderState";
import FlyerService from "@/Services/FlyerService";
import * as pounderFactories from "@Pounders/Factories";
import * as zaps from "@Pounders/Zaps";
import { useClaim } from "@Pounders/Composables/UseClaim";

const { t } = useI18n();

const unionService = new UnionService(useHost());
const llamaService = new DefiLlamaService();
const flyerService = new FlyerService(useHost());

// Refs
const { address } = useWallet();
const store = useUnionStore();

const poundersUnion = computed(() =>
  [store.pounders.ucrv, store.pounders.ucvx, store.pounders.uprisma].filter(
    notEmpty
  )
);

const poundersDeprecated = computed(() =>
  [
    store.pounders.ubal,
    store.pounders.ufxs,
    store.pounders.ufxslp,
    store.pounders.ucrv2,
  ].filter(notEmpty)
);

// Hooks
onMounted(createPounders);

// Claims
const { claim: claimUCrv } = useClaim(unionService, "union", address, true);
const { claim: claimUFxs } = useClaim(unionService, "ufxs", address, true);
const { claim: claimUPrisma } = useClaim(
  unionService,
  "uprisma",
  address,
  true
);
const { claim: claimUCvx } = useClaim(unionService, "ucvx", address, true);
watch(claimUCrv, (claim) => (store.claims.ucrv = claim ?? undefined), {
  immediate: true,
});
watch(claimUFxs, (claim) => (store.claims.ufxs = claim ?? undefined), {
  immediate: true,
});
watch(claimUPrisma, (claim) => (store.claims.uprisma = claim ?? undefined), {
  immediate: true,
});
watch(claimUCvx, (claim) => (store.claims.ucvx = claim ?? undefined), {
  immediate: true,
});

// Methods
const config = useConfig();
function createPounders() {
  createUCvxPounder();
  createUCrvV2Pounder();
  createUCrvPounder();
  createUFxsPounder();
  createUFxsLpPounder();
  createUPrismaPounder();
  createUBalPounder();
}

function createUCvxPounder() {
  const pounder = pounderFactories.createCvxPounder(
    config,
    llamaService,
    flyerService
  );

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCvxDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCvxWithdrawZaps(
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

function createUCrvPounder() {
  const pounder = pounderFactories.createCrvPounder(config, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCrvDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCrvWithdrawZaps(
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
  store.updateClaim(pounder.id, claimUCrv.value ?? undefined);
}

function createUFxsPounder() {
  const pounder = pounderFactories.createFxsPounder(config, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uFxsDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uFxsWithdrawZaps(
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
  store.updateClaim(pounder.id, claimUFxs.value ?? undefined);
}

function createUPrismaPounder() {
  const pounder = pounderFactories.createPrismaPounder(config, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uPrismaDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uPrismaWithdrawZaps(
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
  store.updateClaim(pounder.id, claimUPrisma.value ?? undefined);
}

function createUFxsLpPounder() {
  const pounder = pounderFactories.createFxsLpPounder(config, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uFxsLpDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uFxsLpWithdrawZaps(
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
}

function createUBalPounder() {
  const pounder = pounderFactories.createBalPounder(config, flyerService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uBalDepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uBalWithdrawZaps(
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
}

function createUCrvV2Pounder() {
  const pounder = pounderFactories.createCrvV2Pounder(config, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCrvV2DepositZaps(
        () => config,
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCrvV2WithdrawZaps(
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
}

// Watches
watch(address, createPounders);
</script>

<template>
  <div class="dashboard">
    <Migrations></Migrations>

    <Documentation :extra="t('pounders-info')"></Documentation>

    <PounderComponent
      v-for="pounder in poundersUnion"
      :key="pounder.pounder.id"
      :pounder-id="pounder.pounder.id"
    ></PounderComponent>

    <Card class="information">
      {{ t("pounders-info-deprecated") }}
    </Card>

    <PounderComponent
      v-for="pounder in poundersDeprecated"
      :key="pounder.pounder.id"
      :pounder-id="pounder.pounder.id"
    ></PounderComponent>
  </div>
</template>

<style scoped>
.dashboard {
  > .information {
    font-size: 0.875rem;
    margin-top: 3rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
pounders-info: Union's auto-compounders streamline life for busy llamas.
pounders-info-deprecated: The following pounders are considered legacy. If you're lucky they still yield.
</i18n>

<i18n lang="yaml" locale="zh">
pounders-info: Union的自动复投功能使辛劳的羊驼们更加方便管理他们的贿赂收益。
pounders-info-deprecated: 以下金库被视为传统金库。如果你幸运的话，它们还能产出。
</i18n>

<i18n lang="yaml" locale="fr">
pounders-info: Les auto-compounders de l'Union rendent la vie un peu
  plus facile à gérer pour les llamas qui travaillent dur.
pounders-info-deprecated: Les pounders suivants sont considérés comme des héritages. Si vous avez de la chance, ils sont encore disponibles
</i18n>
