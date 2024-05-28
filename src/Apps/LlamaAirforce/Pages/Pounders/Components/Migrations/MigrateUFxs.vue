<template>
  <Card
    v-if="showMigrate"
    class="migration"
  >
    <h1 v-html="migrationMsg"></h1>
    <span class="actions">
      <a
        :class="{ disabled: !canMigrate }"
        @click="onMigrate(false)"
      >
        {{ t(migrating ? "migrating" : "migrate") }}
      </a>
    </span>

    <ModalSlippage
      symbol-output="cvxFXS"
      :show="modalSlippage"
      :min-amount-out-ref="minAmountOutRef"
      @close="modalSlippage = false"
      @no="modalSlippage = false"
      @yes="onYesModalSlippage"
    ></ModalSlippage>
  </Card>
</template>

<script setup lang="ts">
import { useWallet, approve } from "@/Wallet";
import { ERC20__factory, ZapsUFxs__factory } from "@/Contracts";
import { DefiLlamaService } from "@/Services";
import { getUFxsPriceV1 } from "@Pounders/Zaps/UFxsLp/PriceHelper";
import { calcMinAmountOut } from "@Pounders/Util/MinAmountOutHelper";
import ModalSlippage from "@Pounders/Components/ModalSlippage.vue";

const { t } = useI18n();

const llamaService = new DefiLlamaService(getHost());

// Refs
const { address, withProviderReturn, withSigner } = useWallet();

const showMigrate = ref(false);
const migrating = ref(false);
const balance = ref(0n);

let modalAction: (() => Promise<void>) | null = null;
const minAmountOut = ref(0);
const minAmountOutRef = ref(0);
const modalSlippage = ref(false);

const migrationMsg = computed(() =>
  t("migrateUFxs", [
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
  balance.value = await getBalanceERC20(UnionFxsVaultAddressV1);

  const dust = numToBigNumber(0.1, 18n);
  showMigrate.value = balance.value > dust;
};

// Watches
watch(address, checkCanMigrate);

// Events
const onMigrate = (skipSlippageModal: boolean) =>
  withSigner(async (signer, address) => {
    if (!canMigrate.value) {
      return;
    }

    // Check and ask for slippage first.
    if (!skipSlippageModal) {
      modalSlippage.value = true;
      modalAction = () => onMigrate(true);

      const cvxfxs = await llamaService
        .getPrice(FxsAddress)
        .then((x) => x.price)
        .catch(() => Infinity);

      const ufxs = await getUFxsPriceV1(llamaService, signer);

      minAmountOutRef.value = bigNumToNumber(
        calcMinAmountOut(balance.value, ufxs, cvxfxs, 0),
        18n
      );
      return;
    }

    await tryNotifyLoading(migrating, async () => {
      const erc20 = ERC20__factory.connect(UnionFxsVaultAddressV1, signer);
      await approve(erc20, address, ZapsUFxsAddress, balance.value);

      const migrationMinAmount = numToBigNumber(minAmountOut.value, 18n);
      const zaps = ZapsUFxs__factory.connect(ZapsUFxsAddress, signer);
      const ps = [balance.value, migrationMinAmount, address] as const;

      const estimate = await zaps.estimateGas.depositFromUFxs(...ps);

      await zaps
        .depositFromUFxs(...ps, {
          gasLimit: estimate.mul(125).div(100),
        })
        .then((x) => x.wait());

      balance.value = await getBalanceERC20(UnionFxsVaultAddressV1);
      window.location.reload();
    });
  })();

const onYesModalSlippage = async (newMinAmountOut: number) => {
  modalSlippage.value = false;
  minAmountOut.value = newMinAmountOut;
  await modalAction?.();
};
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
