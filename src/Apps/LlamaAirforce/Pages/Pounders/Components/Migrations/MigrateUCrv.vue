<script setup lang="ts">
import { erc20Abi as abiERC20 } from "viem";
import { abi as abiMigration } from "@/ABI/Union/ZapsUCrv";

const { t } = useI18n();

const { address } = useAccount();

const { data: balanceInfo } = useBalance({
  address,
  token: UnionCrvVaultAddressV2,
});
const balance = computed(() => balanceInfo.value?.value ?? 0n);

const migrationMsg = computed(() =>
  t("migrateUCrv", [
    (Math.round(bigNumToNumber(balance.value, 18n) * 1000) / 1000).toFixed(3),
  ])
);

const canMigrate = computed(() => {
  const dust = numToBigNumber(0.1, 18n);
  return balance.value > dust;
});

const migrating = ref(false);

const { needsApprove } = useApprove(
  UnionCrvVaultAddressV2,
  address,
  ZapsUCrvAddress,
  computed(() => BigInt(balance.value)),
  { maxApprove: false }
);

// Events
const config = useConfig();
function onMigrate() {
  if (!canMigrate.value || migrating.value) {
    return;
  }

  return tryNotifyLoading(migrating, async () => {
    let hash: Address = EmptyAddress;

    if (needsApprove.value) {
      hash = await writeContract(config, {
        abi: abiERC20,
        address: UnionCrvVaultAddressV2,
        functionName: "approve",
        args: [ZapsUCrvAddress, balance.value] as const,
      });

      await waitForTransactionReceipt(config, { hash });
    }

    hash = await writeContract(config, {
      abi: abiMigration,
      address: ZapsUCrvAddress,
      functionName: "depositFromUCrv",
      args: [balance.value, 0n, address.value!] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    window.location.reload();
  });
}
</script>

<template>
  <Card
    v-if="canMigrate"
    class="migration border-flash"
  >
    <div class="migration">
      <h1 v-html="migrationMsg"></h1>
      <span class="actions">
        <a
          :class="{ disabled: !canMigrate || migrating }"
          @click="onMigrate"
        >
          {{ t(migrating ? "migrating" : "migrate") }}
        </a>
      </span>
    </div>
  </Card>
</template>

<style scoped>
.card {
  --flash-color: var(--c-yellow);
}

.migration {
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
migrate: Migrate
migrating: Migrating...
migrateUCrv: Hello ser, you have {0} uCRV you need to migrate!
  <br />The old one will still work, but the new one has a few internal improvements!
</i18n>

<i18n lang="yaml" locale="zh">
migrate: 迁移
migrating: 迁移中...
migrateUCrv: 您好，您好 {0} uCRV 需要迁移到新金库!
  <br />旧的仍然可以工作，但新的有一些内部改进!
</i18n>

<i18n lang="yaml" locale="fr">
migrate: Migrer
migrating: Migration en cours...
migrateUCrv: Bonjour, vous avez {0} uCRV que vous devez migrer!
  <br />L'ancien fonctionnera toujours, mais le nouveau a quelques améliorations internes!
</i18n>
