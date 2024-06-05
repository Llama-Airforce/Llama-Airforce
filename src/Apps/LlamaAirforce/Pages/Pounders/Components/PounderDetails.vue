<template>
  <div class="details">
    <div class="deposit-and-withdraw">
      <div class="deposit">
        <PounderInput
          v-model="deposit"
          :token="state.symbolDeposit"
          :balance="state.balanceDeposit"
          :decimals="state.decimalsDeposit"
        ></PounderInput>

        <div class="actions">
          <ZapSelect
            :class="{ expanded }"
            :zaps="zapsDeposit"
            @select="onDepositSelect"
          ></ZapSelect>

          <Button
            :value="depositLabel"
            :primary="true"
            :web3="true"
            :disabled="!canDeposit"
            @click="onDeposit(false)"
          ></Button>
        </div>
      </div>

      <div class="withdraw">
        <PounderInput
          v-model="withdraw"
          :token="state.symbolWithdraw"
          :balance="withdrawable"
          :decimals="state.decimalsWithdraw"
          :price="(state.priceShare ?? 0) * (state.priceUnderlying ?? 0)"
        ></PounderInput>

        <div class="actions">
          <ZapSelect
            :class="{ expanded }"
            :zaps="zapsWithdraw"
            @select="onWithdrawSelect"
          ></ZapSelect>

          <Button
            :value="withdrawLabel"
            :primary="true"
            :web3="true"
            :disabled="!canWithdraw"
            @click="onWithdraw(false, false)"
          ></Button>

          <ModalYesNo
            :title="t('claim-rewards-title')"
            :show="modalClaim"
            @close="modalClaim = false"
            @no="modalClaim = false"
            @yes="onYesModalClaim"
          >
            <span>{{ t("claim-first") }} </span>
          </ModalYesNo>
        </div>
      </div>
    </div>

    <div class="swap-and-info">
      <div class="description">
        <span class="title">{{ t("information") }}</span>
        <span>{{ description }}</span>
        <span>{{ t("swap-info") }}</span>
      </div>

      <CowSwap
        class="cow"
        :level="1"
        :buy="expanded ? pounderStore?.pounder?.swapSymbols?.buy : ''"
        :sell="pounderStore?.pounder?.swapSymbols?.sell"
      ></CowSwap>
    </div>

    <ModalSlippage
      :show="modalSlippage"
      :symbol-output="symbolOutput"
      :min-amount-out-ref="minAmountOutRef"
      @close="modalSlippage = false"
      @no="modalSlippage = false"
      @yes="onYesModalSlippage"
    ></ModalSlippage>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";
import CowSwap from "@LAF/Components/CowSwap.vue";
import PounderInput from "@Pounders/Components/PounderInput.vue";
import ZapSelect from "@Pounders/Components/ZapSelect.vue";
import { useUnionStore } from "@Pounders/Store";
import type { PounderId, Zap, ZapWithdraw, ZapDeposit } from "@Pounders/Models";
import ModalSlippage from "@Pounders/Components/ModalSlippage.vue";
import { getBalance } from "@Pounders/Util/PounderStateHelper";

const { t } = useI18n();

// Props
interface Props {
  pounderId: PounderId;
  expanded: boolean;
}

const { pounderId, expanded } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  deposit: [];
  withdraw: [];
}>();

// Refs
const { address, getSigner } = useWallet();
const store = useUnionStore();

const modalClaim = ref(false);
const modalSlippage = ref(false);

let modalAction: (() => Promise<void>) | null = null;

const deposit = ref(0n);
const withdraw = ref(0n);

const depositing = ref(false);
const withdrawing = ref(false);

const zapsWithdraw = ref<ZapWithdraw[]>([]);
const zapsDeposit = ref<ZapDeposit[]>([]);

const zapWithdraw = ref<ZapWithdraw | null>(null);
const zapDeposit = ref<ZapDeposit | null>(null);

const minAmountOutRef = ref(0);
const minAmountOut = ref(0);

const symbolOutput = ref("");

const pounderStore = computed(() => store.pounders[pounderId]!);
const description = computed(() => t(pounderStore.value.pounder.description));
const state = computed(() => pounderStore.value.state);
const zapsFactories = computed(() => pounderStore.value.zapsFactories);
const withdrawable = computed((): bigint | null => getBalance(state.value));

const depositInput = computed((): bigint | null => {
  if (!state.value.balanceDeposit) {
    return null;
  }

  return deposit.value > state.value.balanceDeposit
    ? state.value.balanceDeposit
    : deposit.value;
});

const withdrawInput = computed((): bigint | null => {
  if (!withdrawable.value) {
    return null;
  }

  return withdraw.value > withdrawable.value
    ? withdrawable.value
    : withdraw.value;
});

const canDeposit = computed((): boolean => {
  const deposit = depositInput;
  return deposit.value !== null && deposit.value > 0n && !depositing.value;
});

const canWithdraw = computed((): boolean => {
  const withdraw = withdrawInput;
  return withdraw.value !== null && withdraw.value > 0n && !withdrawing.value;
});

const depositLabel = computed((): string =>
  depositing.value ? t("zap-depositing") : t("zap-deposit")
);

const withdrawLabel = computed((): string =>
  withdrawing.value ? t("zap-withdrawing") : t("zap-withdraw")
);

// Watches
const updateZaps = () => {
  zapsDeposit.value = zapsFactories.value.createZapsDeposit(
    () => depositInput.value
  );
  zapDeposit.value = zapsDeposit.value[0];

  zapsWithdraw.value = zapsFactories.value.createZapsWithdrawal(
    () => withdrawInput.value
  );
  zapWithdraw.value = zapsWithdraw.value[0];
};
watch(zapsFactories, updateZaps, { immediate: true });

watch(
  [zapDeposit, address],
  async function () {
    await store.updateZapDeposit(pounderId, zapDeposit.value);
  },
  {
    immediate: true,
  }
);

// Events
const onDeposit = async (skipSlippageModal: boolean): Promise<void> => {
  if (!zapDeposit.value || !depositInput.value) {
    return;
  }

  // Check and ask for slippage first.
  if (zapDeposit.value.getMinAmountOut) {
    if (!skipSlippageModal) {
      modalSlippage.value = true;
      modalAction = () => onDeposit(true);

      const signer = getSigner();
      if (!signer) {
        return;
      }

      minAmountOutRef.value = await zapDeposit.value
        .getMinAmountOut(getHost(), signer, depositInput.value, 0)
        .then((x) => bigNumToNumber(x, state.value.decimalsWithdraw));
      symbolOutput.value = pounderStore.value.pounder.symbol;

      return;
    }
  } else {
    minAmountOut.value = 0;
  }

  await tryNotifyLoading(depositing, async () => {
    if (!zapDeposit.value) return;

    const zapMinAmountOut = numToBigNumber(
      minAmountOut.value,
      state.value.decimalsWithdraw
    );
    await zapDeposit.value.zap(zapMinAmountOut);

    deposit.value = 0n;
    await store.updateZapDeposit(pounderId, zapDeposit.value);
    emit("deposit");
  });
};

const onWithdraw = async (
  skipClaimModal: boolean,
  skipSlippageModal: boolean
): Promise<void> => {
  if (
    !zapWithdraw.value ||
    !withdrawInput.value ||
    state.value.balanceWithdraw === null
  ) {
    return;
  }

  // Check and ask for claim first.
  modalClaim.value = withdrawInput.value > state.value.balanceWithdraw;

  if (modalClaim.value && !skipClaimModal) {
    modalAction = () => onClaimAndWithdraw();
    return;
  }

  modalClaim.value = false;

  const decimals = await zapWithdraw.value.withdrawDecimals();
  if (!decimals) {
    return;
  }

  // Check and ask for slippage first.
  if (zapWithdraw.value.getMinAmountOut) {
    if (!skipSlippageModal) {
      modalSlippage.value = true;
      modalAction = () => onWithdraw(true, true);

      const signer = getSigner();
      if (!signer) {
        return;
      }

      minAmountOutRef.value = await zapWithdraw.value
        .getMinAmountOut(getHost(), signer, withdrawInput.value, 0)
        .then((x) => bigNumToNumber(x, state.value.decimalsDeposit));
      symbolOutput.value = zapWithdraw.value.withdrawSymbol;

      return;
    }
  } else {
    minAmountOut.value = 0;
  }

  await tryNotifyLoading(withdrawing, async () => {
    if (!zapWithdraw.value) return;

    const zapMinAmountOut = numToBigNumber(minAmountOut.value, decimals);
    await zapWithdraw.value.zap(zapMinAmountOut);

    withdraw.value = 0n;
    emit("withdraw");
  });
};

const onClaimAndWithdraw = async (): Promise<void> => {
  const distributor = pounderStore.value.pounder.distributor();
  const claim = pounderStore.value.claim;
  if (!claim || !distributor) {
    return;
  }

  const amount = BigInt(claim.amount);

  await tryNotify(async () => {
    if (!address.value) {
      return;
    }

    await distributor
      .claim(claim.index, address.value, amount, claim.proof)
      .then((x) => x.wait());

    await onWithdraw(true, false);
  });
};

const onYesModalClaim = async () => {
  modalClaim.value = false;
  await modalAction?.();
};

const onYesModalSlippage = async (newMinAmountOut: number) => {
  modalSlippage.value = false;
  minAmountOut.value = newMinAmountOut;
  await modalAction?.();
};

const onDepositSelect = (zap: Zap): void => {
  zapDeposit.value = zap as ZapDeposit;
};

const onWithdrawSelect = (zap: Zap): void => {
  zapWithdraw.value = zap as ZapWithdraw;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.details {
  display: flex;
  flex-direction: column;

  margin: 1rem 2rem;
  gap: var(--dashboard-gap);
  border-top: solid 1px var(--c-lvl4);

  > .deposit-and-withdraw {
    display: flex;
    flex-direction: row;

    @media only screen and (max-width: 1280px) {
      flex-direction: column;
    }

    gap: 2rem;

    > .deposit {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;

      > .actions {
        display: flex;
        flex-direction: column;

        > .select {
          position: absolute;
          width: 15rem;

          &:not(.expanded) {
            display: none;
          }
        }

        > button {
          align-self: flex-end;
        }
      }
    }

    > .withdraw {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;

      > .actions {
        display: flex;
        flex-direction: column;

        > .select {
          position: absolute;
          width: 15rem;

          &:not(.expanded) {
            display: none;
          }
        }

        > button {
          align-self: flex-end;
        }
      }
    }
  }

  > .swap-and-info {
    margin-top: 1rem;

    display: grid;
    gap: var(--dashboard-gap);
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "swap info";

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    > .cow {
      grid-area: swap;
    }

    > .description {
      grid-area: info;

      display: flex;
      flex-direction: column;
      gap: 1ch;
      line-height: 1.5rem;

      > .title {
        font-weight: bold;
        font-size: 1.125rem;
        margin-bottom: -0.5ch;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
zap-deposit: Deposit
zap-depositing: Depositing...
zap-withdraw: Withdraw
zap-withdrawing: Withdrawing...
claim-rewards-title: Claim Union rewards
claim-first: In order to withdraw the requested amount you first need to claim
  your Union rewards

description-ucrv: This pounder stakes cvxCRV single-sidedly on Convex.
  Llama Airforce devs actively choose the highest yielding reward weight option for the staked cvxCRV.
description-ufxs: This pounder stakes cvxFXS single-sidedly on Convex.
description-uprisma: This pounder stakes cvxPRISMA single-sidedly on Convex.
description-ucvx: This pounder stakes pxCVX and compounds the earned bribe rewards for more pxCVX.
description-ubal: This pounder stakes auraBAL on Aura.
description-ufxslp: This pounder stakes cvxFXS/FXS LP tokens on Convex.
  This staking method no longer actively rewarded by Convex; these rewards have been moved to single-sided cvxFXS staking.

information: Information
swap-info: The preferred method for depositing is using the available zaps from the dropdown menu. If your preferred token is not listed, we recommend using the CoWSwap widget for MEV-protected trading with optimal routing into the native pounder token, which you can then deposit. Although this two-step process might be a bit cumbersome, it ensures your safety. The same method applies for withdrawing from the pounder.
</i18n>

<i18n lang="yaml" locale="zh">
zap-deposit: 订金
zap-depositing: 订金。。。
zap-withdraw: 提取
zap-withdrawing: 提取。。。
claim-rewards-title: 索取奖励
claim-first: 在提取您要求的金额之前，请先领取您的收益

information: 信息
swap-info: 存款的首选方法是使用下拉菜单中的可用 Zaps。如果您首选的代币没有列出，我们建议您使用 CoWSwap 小工具进行 MEV 保护交易，并将其优化路由到本地 pounder 代币，然后再存入。虽然这两个步骤可能有点繁琐，但可以确保您的安全。同样的方法也适用于从 pounder 取款。
</i18n>

<i18n lang="yaml" locale="fr">
zap-deposit: Déposer
zap-depositing: Déposer...
zap-withdraw: Retirer
zap-withdrawing: Retirer...
claim-rewards-title: Réclamer les récompenses de l'Union
claim-first: Pour retirer le montant demandé, vous devez d'abord réclamer
  vos récompenses de l'Union

description-ucrv: Ce pounder stake du cvxCRV en unilatéral sur Convex.
  Les développeurs de Llama Airforce sélectionnent activement l'option de récompense offrant le rendement le plus élevé pour le cvxCRV staké.
description-ufxs: Ce pounder stake du cvxFXS en unilatéral sur Convex.
description-uprisma: Ce pounder stake du cvxPRISMA en unilatéral sur Convex.
description-ucvx: Ce pounder stake du pxCVX et compounde les récompenses de pots-de-vin gagnées pour plus de pxCVX.
description-ubal: Ce pounder stake de l'auraBAL sur Aura.
description-ufxslp: Ce pounder stake des tokens cvxFXS/FXS LP sur Convex.
  Cette méthode de staking n'est plus activement récompensée par Convex; les récompenses ont été déplacées vers le staking cvxFXS unilatéral.

information: Informations
swap-info: La méthode préférée pour le dépôt est l'utilisation des zaps disponibles à partir du menu déroulant. Si votre jeton préféré ne figure pas dans la liste, nous vous recommandons d'utiliser le widget CoWSwap pour un échange protégé par MEV avec un acheminement optimal vers le jeton pounder natif, que vous pouvez ensuite déposer. Bien que ce processus en deux étapes puisse être un peu lourd, il garantit votre sécurité. La même méthode s'applique pour le retrait du pounder.
</i18n>
