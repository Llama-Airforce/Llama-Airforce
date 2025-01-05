<script setup lang="ts">
import { erc20Abi as abiERC20 } from "viem";
import { abi as abiMigration } from "@/ABI/Union/ZapsUFxs";
import { DefiLlamaService } from "@/Services";
import { getUFxsPriceV1 } from "@Pounders/Zaps/UFxsLp/PriceHelper";
import { calcMinAmountOut } from "@Pounders/Zaps/Helpers";
import ModalSlippage from "@Pounders/Components/ModalSlippage.vue";

const { t } = useI18n();

const llamaService = new DefiLlamaService();

// Refs
const { address } = useWallet();

const { data: balanceInfo } = useBalance({
  address,
  token: UnionFxsVaultAddressV1,
});
const balance = computed(() => balanceInfo.value?.value ?? 0n);

let modalAction: (() => Promise<void>) | null = null;
const minAmountOut = ref(0);
const minAmountOutRef = ref(0);
const modalSlippage = ref(false);

const migrationMsg = computed(() =>
  t("migrateUFxs", [
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
async function onMigrate(skipSlippageModal: boolean) {
  if (!canMigrate.value || migrating.value) {
    return;
  }

  // Check and ask for slippage first.
  if (!skipSlippageModal) {
    modalSlippage.value = true;
    modalAction = () => onMigrate(true);

    const cvxfxs = await llamaService
      .getPrice(FxsAddress)
      .then((x) => x?.price ?? Infinity)
      .catch(() => Infinity);

    const ufxs = await getUFxsPriceV1(llamaService, config);

    minAmountOutRef.value = bigNumToNumber(
      calcMinAmountOut(balance.value, ufxs, cvxfxs, 0),
      18n
    );
    return;
  }

  await tryNotifyLoading(migrating, async () => {
    let hash = await writeContract(config, {
      abi: abiERC20,
      address: UnionFxsVaultAddressV1,
      functionName: "approve",
      args: [ZapsUFxsAddress, balance.value] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    const migrationMinAmount = numToBigNumber(minAmountOut.value, 18n);
    hash = await writeContract(config, {
      abi: abiMigration,
      address: ZapsUFxsAddress,
      functionName: "depositFromUFxs",
      args: [balance.value, migrationMinAmount, address.value!] as const,
    });

    await waitForTransactionReceipt(config, { hash });

    window.location.reload();
  });
}

const onYesModalSlippage = async (newMinAmountOut: number) => {
  modalSlippage.value = false;
  minAmountOut.value = newMinAmountOut;
  await modalAction?.();
};
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
          @click="onMigrate(false)"
        >
          {{ t(migrating ? "migrating" : "migrate") }}
        </a>
      </span>

      <ModalSlippage
        symbol-output="cvxFXS"
        :show="modalSlippage"
        :min-amount-out-ref
        @close="modalSlippage = false"
        @no="modalSlippage = false"
        @yes="onYesModalSlippage"
      />
    </div>
  </Card>
</template>

<style scoped>
.card {
  --flash-color: var(--c-red);
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
migrateUFxs: Hello ser, you have {0} uFXS you need to migrate!
  <br />It's sitting in the old pounder now, not earning rewards!
</i18n>

<i18n lang="yaml" locale="zh">
migrate: 迁移
migrating: 迁移中...
migrateUFxs: 您好，您有{0} uFXS 需要迁移到新金库！
  <br />您在旧金库中无法获得收益
</i18n>

<i18n lang="yaml" locale="fr">
migrate: Migrer
migrating: Migration en cours...
migrateUFxs: Bonjour, vous avez {0} uFXS que vous devez migrer!
  <br />Il est actuellement dans l'ancien pounder, il n'accumule pas de récompenses!
</i18n>
