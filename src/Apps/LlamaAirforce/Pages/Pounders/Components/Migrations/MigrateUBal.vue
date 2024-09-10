<script setup lang="ts">
import { erc20Abi as abiERC20 } from "viem";
import { abi as abiVault } from "@/ABI/Union/UnionVault";
import { useWallet } from "@/Wallet";

const { t } = useI18n();

// Refs
const { address } = useWallet();

const migrationUBalMsg = computed(() => {
  return t("migrateUBal", [
    (Math.round(bigNumToNumber(balanceUBal.value, 18n) * 1000) / 1000).toFixed(
      3
    ),
  ]);
});

const canWithdraw = computed(() => balanceUBal.value > 0n && !migrating.value);

const canDeposit = computed(
  () =>
    balanceUBal.value === 0n && balanceAuraBal.value > 0n && !migrating.value
);

const canMigrate = computed(() => {
  const dust = numToBigNumber(0.1, 18n);
  return balanceUBal.value > dust;
});

const migrating = ref(false);

const { data: balanceUBalInfo, refetch: refetchBalanceUBal } = useBalance({
  address,
  token: UnionBalVaultAddressV1,
});
const balanceUBal = computed(() => balanceUBalInfo.value?.value ?? 0n);

const { data: balanceAuraBalInfo, refetch: refetchBalanceAuraBal } = useBalance(
  {
    address,
    token: AuraBalAddress,
  }
);
const balanceAuraBal = computed(() => balanceAuraBalInfo.value?.value ?? 0n);

// Events
const config = useConfig();
function onWithdrawUBal() {
  if (!canMigrate.value || migrating.value) {
    return;
  }

  return tryNotifyLoading(migrating, async () => {
    const hash = await writeContract(config, {
      abi: abiVault,
      address: UnionBalVaultAddressV1,
      functionName: "withdrawAll",
      args: [address.value!] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    await Promise.all([refetchBalanceUBal(), refetchBalanceAuraBal()]);
  });
}

function onDepositAuraBal() {
  if (!canMigrate.value || migrating.value) {
    return;
  }

  return tryNotifyLoading(migrating, async () => {
    let hash = await writeContract(config, {
      abi: abiERC20,
      address: AuraBalAddress,
      functionName: "approve",
      args: [UnionBalVaultAddress, balanceAuraBal.value] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    hash = await writeContract(config, {
      abi: abiVault,
      address: UnionBalVaultAddress,
      functionName: "deposit",
      args: [address.value!, balanceAuraBal.value] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    window.location.reload();
  });
}
</script>

<template>
  <Card
    v-if="canMigrate"
    class="border-flash"
  >
    <div class="migrations">
      <h1 v-html="migrationUBalMsg"></h1>
      <span class="actions">
        <a
          :class="{ disabled: !canWithdraw || migrating }"
          @click="onWithdrawUBal"
        >
          {{ t("withdraw") }}
        </a>
        <a
          :class="{ disabled: !canDeposit || migrating }"
          @click="onDepositAuraBal"
        >
          {{ t("deposit") }}
        </a>
      </span>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.card {
  --flash-color: var(--c-red-rgb);
}

.migrations {
  display: flex;
  justify-content: space-between;

  h1 {
    font-size: 1rem;
  }

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
</style>

<i18n lang="yaml" locale="en">
withdraw: Withdraw from old vault
deposit: Deposit into new vault
migrateUBal: Hello ser, you have {0} uBAL you need to migrate!
  <br />It's sitting in the old pounder now, not earning rewards!
</i18n>

<i18n lang="yaml" locale="zh">
withdraw: 从旧金库中提款
deposit: 存款到新的金库
migrateUBal: 您好，您有{0} uBAL 需要迁移到新金库！
  <br />您在旧金库中无法获得收益
</i18n>

<i18n lang="yaml" locale="fr">
withdraw: Retirer de l'ancien coffre
deposit: Déposer dans le nouveau coffre
migrateUBal: Bonjour, vous avez {0} uBAL que vous devez migrer!
  <br />Il est actuellement dans l'ancien pounder, il n'accumule pas de récompenses!
</i18n>
