<template>
  <div class="union">
    <div class="dashboard">
      <Migrations></Migrations>

      <Documentation :extra="t('pounders-info')"></Documentation>

      <PounderComponent
        v-for="pounder in poundersUnion"
        :key="pounder.pounder.id"
        :pounder-id="pounder.pounder.id"
      ></PounderComponent>

      <Card class="information">
        {{ t("pounders-info-other") }}
      </Card>

      <PounderComponent
        v-for="pounder in poundersOther"
        :key="pounder.pounder.id"
        :pounder-id="pounder.pounder.id"
      ></PounderComponent>

      <Card class="information">
        {{ t("pounders-info-legacy") }}
      </Card>

      <PounderComponent
        v-for="pounder in poundersLegacy"
        :key="pounder.pounder.id"
        :pounder-id="pounder.pounder.id"
      ></PounderComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PublicClient } from "viem";
import { getPublicClient, getWalletClient } from "@wagmi/core";
import { useConfig } from "@wagmi/vue";
import { useWallet } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import UnionService from "@LAF/Services/UnionService";
import Documentation from "@LAF/Components/Documentation.vue";
import Migrations from "@Pounders/Components/Migrations/Migrations.vue";
import PounderComponent from "@Pounders/Components/Pounder.vue";
import { useUnionStore } from "@Pounders/Store";
import type { ZapsFactories } from "@Pounders/Models";
import FlyerService from "@/Services/FlyerService";
import * as pounderFactories from "@Pounders/Factories";
import * as zaps from "@Pounders/Zaps";
import { create as createPounderState } from "@Pounders/Util/PounderStateHelper";
import { useClaim } from "@Pounders/Composables/UseClaim";

const { t } = useI18n();

const unionService = new UnionService(getHost());
const llamaService = new DefiLlamaService(getHost());
const flyerService = new FlyerService(getHost());

// Refs
const { address } = useWallet();
const store = useUnionStore();

const poundersUnion = computed(() =>
  [
    store.pounders.ucrv,
    store.pounders.ufxs,
    store.pounders.ucvx,
    store.pounders.uprisma,
  ].filter(notEmpty)
);

const poundersOther = computed(() =>
  [store.pounders.ubal, store.pounders.ufxslp].filter(notEmpty)
);

const poundersLegacy = computed(() => [store.pounders.ucrv2].filter(notEmpty));

// Hooks
onMounted(createPounders);

// Claims
const { claim: claimUCrv } = useClaim(unionService, "union", address);
const { claim: claimUFxs } = useClaim(unionService, "ufxs", address);
const { claim: claimUPrisma } = useClaim(unionService, "uprisma", address);
const { claim: claimUCvx } = useClaim(unionService, "ucvx", address);
watch(claimUCrv, (newClaim) => (store.claims.ucrv = newClaim), {
  immediate: true,
});
watch(claimUFxs, (newClaim) => (store.claims.ufxs = newClaim), {
  immediate: true,
});
watch(claimUPrisma, (newClaim) => (store.claims.uprisma = newClaim), {
  immediate: true,
});
watch(claimUCvx, (newClaim) => (store.claims.ucvx = newClaim), {
  immediate: true,
});

// Methods
const config = useConfig();
function createPounders() {
  const client = getPublicClient(config);
  if (!client) {
    return;
  }

  createUCvxPounder(client);
  createUCrvV2Pounder(client);
  createUCrvPounder(client);
  createUFxsPounder(client);
  createUFxsLpPounder(client);
  createUPrismaPounder(client);
  createUBalPounder(client);
}

function createUCvxPounder(client: PublicClient) {
  const pounder = pounderFactories.createCvxPounder(
    client,
    llamaService,
    flyerService
  );

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCvxDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCvxWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUCrvPounder(client: PublicClient) {
  const pounder = pounderFactories.createCrvPounder(client, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCrvDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCrvWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUFxsPounder(client: PublicClient) {
  const pounder = pounderFactories.createFxsPounder(client, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uFxsDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uFxsWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUPrismaPounder(client: PublicClient) {
  const pounder = pounderFactories.createPrismaPounder(client, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uPrismaDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uPrismaWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUFxsLpPounder(client: PublicClient) {
  const pounder = pounderFactories.createFxsLpPounder(client, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uFxsLpDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uFxsLpWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUBalPounder(client: PublicClient) {
  const pounder = pounderFactories.createBalPounder(client, flyerService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uBalDepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uBalWithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

function createUCrvV2Pounder(client: PublicClient) {
  const pounder = pounderFactories.createCrvV2Pounder(client, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | undefined) =>
      zaps.uCrvV2DepositZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
        () => address.value,
        getInput
      ),
    createZapsWithdrawal: (getInput: () => bigint | undefined) =>
      zaps.uCrvV2WithdrawZaps(
        () => getPublicClient(config),
        () => getWalletClient(config),
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("union");

.union {
  .dashboard {
    > .information {
      font-size: 0.875rem;

      &:not(:nth-child(1 of .information)) {
        margin-top: 3rem;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
pounders-info: Union's auto-compounders streamline life for busy llamas.
pounders-info-other: The following pounders are not part of the Union's allocation set, but they still make life easier.
pounders-info-legacy: The following pounders are considered legacy. They still work, but we recommend migrating.
</i18n>

<i18n lang="yaml" locale="zh">
pounders-info: Union的自动复投功能使辛劳的羊驼们更加方便管理他们的贿赂收益。
pounders-info-other: 以下金库不属于Union的分配集，但它们仍然使生活更容易。
pounders-info-legacy: 下面的保险库被认为是传统的。它们仍然有效，但我们建议迁移。
</i18n>

<i18n lang="yaml" locale="fr">
pounders-info: Les auto-compounders de l'Union rendent la vie un peu
  plus facile à gérer pour les llamas qui travaillent dur.
pounders-info-other: Les pounders suivants ne font pas partie de l'ensemble d'allocation de l'Union, mais ils rendent tout de même la vie plus facile.
pounders-info-legacy: Les pounders suivants sont considérés comme étant obsolètes. Ils fonctionnent toujours, mais nous recommandons de migrer vers une solution plus récente.
</i18n>
