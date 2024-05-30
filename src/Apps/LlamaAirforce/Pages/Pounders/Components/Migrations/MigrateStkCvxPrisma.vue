<template>
  <Card
    v-if="showMigrate"
    class="migration"
  >
    <h1 v-html="migrationMsg"></h1>
    <span class="actions">
      <a
        :class="{ disabled: !canMigrate }"
        @click="onMigrate"
      >
        {{ t(migrating ? "migrating" : "migrate") }}
      </a>
    </span>
  </Card>
</template>

<script setup lang="ts">
import { useWallet, approve } from "@/Wallet";
import {
  ERC20__factory,
  ZapsUPrismaConvexMigration__factory,
} from "@/Contracts";

const { t } = useI18n();

// Refs
const { address, withProviderReturn, withSigner } = useWallet();

const showMigrate = ref(false);
const migrating = ref(false);
const balance = ref(0n);

const migrationMsg = computed(() =>
  t("migrateStkCvxCrv", [
    (Math.round(bigNumToNumber(balance.value, 18n) * 1000) / 1000).toFixed(3),
  ])
);

const canMigrate = computed(() => balance.value > 0n && !migrating.value);

// Hooks
onMounted(async (): Promise<void> => {
  await checkCanMigrate();
});

// Methods
const getBalanceERC20 = (ERC20address: string) =>
  withProviderReturn(
    async (provider, address) => {
      const erc20 = ERC20__factory.connect(ERC20address, provider);
      const balance = await erc20.balanceOf(address);

      return balance.toBigInt();
    },
    () => 0n
  )();

const checkCanMigrate = async () => {
  balance.value = await getBalanceERC20(StkCvxPrismaAddress);

  const dust = numToBigNumber(0.1, 18n);
  showMigrate.value = balance.value > dust;
};

// Watches
watch(address, checkCanMigrate);

// Events
const onMigrate = withSigner((signer, address) => {
  if (!canMigrate.value) {
    return new Promise((resolve) => resolve());
  }

  return tryNotifyLoading(migrating, async () => {
    const erc20 = ERC20__factory.connect(StkCvxPrismaAddress, signer);
    await approve(
      erc20,
      address,
      ZapsUPrismaConvexMigrationAddress,
      balance.value
    );

    const zaps = ZapsUPrismaConvexMigration__factory.connect(
      ZapsUPrismaConvexMigrationAddress,
      signer
    );
    const ps = [balance.value, address] as const;

    const estimate = await zaps.estimateGas.migrate(...ps);

    await zaps
      .migrate(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    balance.value = await getBalanceERC20(StkCvxPrismaAddress);
    window.location.reload();
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.migration {
  @include border(var(--c-yellow-rgb), true);

  h1 {
    font-size: 1rem;
  }

  ::v-deep(.card-body) {
    display: flex;
    justify-content: space-between;

    .actions {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      a {
        align-self: center;
        cursor: pointer;

        &.disabled {
          color: var(--c-lvl5);
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
migrate: Migrate
migrating: Migrating...
migrateStkCvxCrv: Hello ser, it seems you have {0} cvxPRISMA staked in Convex.
  <br />Do you wish to move those cheaply into the pounder?
</i18n>

<i18n lang="yaml" locale="zh">
migrate: 迁移
migrating: 迁移中...
migrateStkCvxCrv: 您好，先生，您似乎在 Convex 下注了 {0} cvxPRISMA。
  <br />你想廉价地把钱存入金库吗？
</i18n>

<i18n lang="yaml" locale="fr">
migrate: Migrer
migrating: Migration en cours...
migrateStkCvxCrv:
  Bonjour, il semble que vous ayez {0} cvxPRISMA mis en jeu dans Convex.
  <br />Souhaitez-vous les transférer à bas prix dans le pounder?
</i18n>