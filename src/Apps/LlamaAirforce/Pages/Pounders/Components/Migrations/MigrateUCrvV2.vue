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
import { ERC20__factory, ZapsUCrvV2__factory } from "@/Contracts";

const { t } = useI18n();

// Refs
const { address, withProviderReturn, withSigner } = useWallet();

const showMigrate = ref(false);
const migrating = ref(false);
const balance = ref(0n);

const migrationMsg = computed(() =>
  t("migrateUCrv", [
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
  balance.value = await getBalanceERC20(UnionCrvVaultAddressV1);

  const dust = numToBigNumber(0.1, 18n);
  showMigrate.value = balance.value > dust;
};

// Watches
watch(address, checkCanMigrate);

// Events
const onMigrate = withSigner(async (signer, address) => {
  if (!canMigrate.value) {
    return new Promise((resolve) => resolve());
  }

  return tryNotifyLoading(migrating, async () => {
    const erc20 = ERC20__factory.connect(UnionCrvVaultAddressV1, signer);
    await approve(erc20, address, ZapsUCrvAddressV2, balance.value);

    const zaps = ZapsUCrvV2__factory.connect(ZapsUCrvAddressV2, signer);
    const ps = [balance.value, 0, address] as const;

    const estimate = await zaps.estimateGas.depositFromUCrv(...ps);

    await zaps
      .depositFromUCrv(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    balance.value = await getBalanceERC20(UnionCrvVaultAddressV1);
    window.location.reload();
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.migration {
  @include border(var(--c-red-rgb), true);

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
migrateUCrvV2: Hello ser, you have {0} uCRV you need to migrate!
  <br />It might still earn yield, but it will be subpar!
</i18n>

<i18n lang="yaml" locale="zh">
migrate: 迁移
migrating: 迁移中...
migrateUCrvV2: 您好，您好 {0} uCRV 需要迁移到新金库!
  <br />您在旧金库中可以继续获得收益，但会逐步减少!
</i18n>

<i18n lang="yaml" locale="fr">
migrate: Migrer
migrating: Migration en cours...
migrateUCrvV2: Bonjour, vous avez {0} uCRV que vous devez migrer!
  <br />Il pourrait toujours générer du rendement, mais il serait inférieur!
</i18n>