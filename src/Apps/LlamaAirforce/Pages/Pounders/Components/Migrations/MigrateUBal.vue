<template>
  <Card
    v-if="canMigrate"
    class="migrations"
  >
    <h1 v-html="migrationUBalMsg"></h1>
    <span class="actions">
      <a
        :class="{ disabled: !canWithdraw }"
        @click="onWithdrawUBal"
      >
        {{ t("withdraw") }}
      </a>
      <a
        :class="{ disabled: !canDeposit }"
        @click="onDepositAuraBal"
      >
        {{ t("deposit") }}
      </a>
    </span>
  </Card>
</template>

<script setup lang="ts">
import { useWallet, maxApprove } from "@/Wallet";
import { ERC20__factory, UnionVault__factory } from "@/Contracts";

const { t } = useI18n();

// Refs
const { address, withProviderReturn, withSigner } = useWallet();

const canMigrate = ref(false);
const migrating = ref(false);

const balanceUBal = ref(0n);
const balanceUBalStart = ref(0n);
const balanceAuraBal = ref(0n);

const migrationUBalMsg = computed(() => {
  return t("migrateUBal", [
    (
      Math.round(bigNumToNumber(balanceUBalStart.value, 18n) * 1000) / 1000
    ).toFixed(3),
  ]);
});

const canWithdraw = computed(() => balanceUBal.value > 0n && !migrating.value);
const canDeposit = computed(
  () =>
    balanceUBal.value === 0n && balanceAuraBal.value > 0n && !migrating.value
);

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
  const ubal = await getBalanceERC20(UnionBalVaultAddressV1);
  balanceUBal.value = ubal;
  balanceUBalStart.value = ubal;

  const dust = numToBigNumber(0.1, 18n);
  canMigrate.value = balanceUBalStart.value > dust;
};

// Watches
watch(address, checkCanMigrate);

// Events
const onWithdrawUBal = withSigner((signer, address) => {
  if (!canWithdraw.value) {
    return new Promise((resolve) => resolve());
  }

  return tryNotifyLoading(migrating, async () => {
    await UnionVault__factory.connect(UnionBalVaultAddressV1, signer)
      .withdrawAll(address)
      .then((x) => x.wait());

    balanceUBal.value = await getBalanceERC20(UnionBalVaultAddressV1);
    balanceAuraBal.value = await getBalanceERC20(AuraBalAddress);
  });
});

const onDepositAuraBal = withSigner((signer, address) => {
  if (!canDeposit.value) {
    return new Promise((resolve) => resolve());
  }

  return tryNotifyLoading(migrating, async () => {
    const utkn = UnionVault__factory.connect(UnionBalVaultAddress, signer);
    const atkn = ERC20__factory.connect(AuraBalAddress, signer);

    await maxApprove(atkn, address, UnionBalVaultAddress, balanceAuraBal.value);

    const ps = [address, balanceAuraBal.value] as const;

    const estimate = await utkn.estimateGas.deposit(...ps);

    await utkn
      .deposit(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    canMigrate.value = false;
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.migrations {
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

<i18n lang="yaml" src="@/locales/union.yml"></i18n>
