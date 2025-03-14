<script setup lang="ts">
import { erc20Abi as abiERC20 } from "viem";
import { abi as abiMigration } from "@/ABI/Union/ZapsUPrismaConvexMigration";

const { t } = useI18n();

const { address } = useAccount();

const { data: balanceInfo } = useBalance({
  address,
  token: StkCvxPrismaAddress,
});
const balance = computed(() => balanceInfo.value?.value ?? 0n);

const migrationMsg = computed(() =>
  t("migrateStkCvxCrv", [
    (Math.round(bigNumToNumber(balance.value, 18n) * 1000) / 1000).toFixed(3),
  ])
);

const canMigrate = computed(() => {
  const dust = numToBigNumber(0.1, 18n);
  return balance.value > dust;
});

const migrating = ref(false);

// Events
const config = useConfig();
function onMigrate() {
  if (!canMigrate.value || migrating.value) {
    return;
  }

  return tryNotifyLoading(migrating, async () => {
    let hash = await writeContract(config, {
      abi: abiERC20,
      address: StkCvxPrismaAddress,
      functionName: "approve",
      args: [ZapsUPrismaConvexMigrationAddress, balance.value] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    hash = await writeContract(config, {
      abi: abiMigration,
      address: ZapsUPrismaConvexMigrationAddress,
      functionName: "migrate",
      args: [balance.value, address.value!] as const,
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
