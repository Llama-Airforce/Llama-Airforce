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
import { type JsonRpcSigner } from "@ethersproject/providers";
import { useWallet } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import UnionService from "@LAF/Services/UnionService";
import Documentation from "@LAF/Components/Documentation.vue";
import Migrations from "@Pounders/Components/Migrations/Migrations.vue";
import PounderComponent from "@Pounders/Components/Pounder.vue";
import { useUnionStore } from "@Pounders/Store";
import { getClaim } from "@Pounders/Util/UnionHelper";
import type { ZapsFactories } from "@Pounders/Models";
import FlyerService from "@/Services/FlyerService";
import * as pounderFactories from "@Pounders/Factories";
import * as zaps from "@Pounders/Zaps";
import { create as createPounderState } from "@Pounders/Util/PounderStateHelper";

const { t } = useI18n();

const unionService = new UnionService(getHost());
const llamaService = new DefiLlamaService(getHost());
const flyerService = new FlyerService(getHost());

// Refs
const { address, withSigner } = useWallet();
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
onMounted(
  withSigner(async (signer) => {
    createPounders(signer);
    await updateClaims();
  })
);

// Methods
const updateClaims = withSigner(async (signer, address) => {
  const provider = signer.provider;

  store.pounders.ucrv!.claim = await getClaim(
    provider,
    unionService,
    "union",
    address
  );

  store.pounders.ufxs!.claim = await getClaim(
    provider,
    unionService,
    "ufxs",
    address
  );

  store.pounders.uprisma!.claim = await getClaim(
    provider,
    unionService,
    "uprisma",
    address
  );

  store.pounders.ucvx!.claim = await getClaim(
    provider,
    unionService,
    "ucvx",
    address
  );
});

const createPounders = (signer: JsonRpcSigner) => {
  createUCvxPounder(signer);
  createUCrvV2Pounder(signer);
  createUCrvPounder(signer);
  createUFxsPounder(signer);
  createUFxsLpPounder(signer);
  createUPrismaPounder(signer);
  createUBalPounder(signer);
};

const createUCvxPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createCvxPounder(
    signer,
    llamaService,
    flyerService
  );

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uCvxDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uCvxWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUCrvPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createCrvPounder(signer, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uCrvDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uCrvWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUFxsPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createFxsPounder(signer, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uFxsDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uFxsWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUPrismaPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createPrismaPounder(signer, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uPrismaDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uPrismaWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUFxsLpPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createFxsLpPounder(signer, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uFxsLpDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uFxsLpWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUBalPounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createBalPounder(signer, flyerService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uBalDepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uBalWithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

const createUCrvV2Pounder = (signer: JsonRpcSigner) => {
  const pounder = pounderFactories.createCrvV2Pounder(signer, llamaService);

  const zapsFactories: ZapsFactories = {
    createZapsDeposit: (getInput: () => bigint | null) =>
      zaps.uCrvV2DepositZaps(
        () => address.value,
        getInput,
        () => pounder.utkn,
        () => pounder.atkn
      ),
    createZapsWithdrawal: (getInput: () => bigint | null) =>
      zaps.uCrvV2WithdrawZaps(
        () => address.value,
        getInput,
        () => pounder.utkn
      ),
  };

  store.pounders[pounder.id] = {
    pounder,
    zapsFactories,
    state: createPounderState(),
    claim: null,
  };
};

// Watches
watch(
  address,
  withSigner(async (signer) => {
    createPounders(signer);
    await updateClaims();
  })
);
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
