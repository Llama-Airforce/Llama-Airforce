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
import { useWallet } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import UnionService, {
  API_URL as UNION_API_URL,
} from "@LAF/Services/UnionService";
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

const unionService = new UnionService(useHost(UNION_API_URL));
const llamaService = new DefiLlamaService();
const flyerService = new FlyerService(useHost());

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
const { claim: claimUCrv } = useClaim(unionService, "union", address, true);
const { claim: claimUFxs } = useClaim(unionService, "ufxs", address, true);
const { claim: claimUPrisma } = useClaim(
  unionService,
  "uprisma",
  address,
  true
);
const { claim: claimUCvx } = useClaim(unionService, "ucvx", address, true);
watch(claimUCrv, (newClaim) => (store.claims.ucrv = newClaim ?? undefined), {
  immediate: true,
});
watch(claimUFxs, (newClaim) => (store.claims.ufxs = newClaim ?? undefined), {
  immediate: true,
});
watch(
  claimUPrisma,
  (newClaim) => (store.claims.uprisma = newClaim ?? undefined),
  {
    immediate: true,
  }
);
watch(claimUCvx, (newClaim) => (store.claims.ucvx = newClaim ?? undefined), {
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
