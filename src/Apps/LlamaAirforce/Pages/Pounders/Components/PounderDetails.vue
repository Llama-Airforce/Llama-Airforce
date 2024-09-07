<script setup lang="ts">
import { mainnet } from "viem/chains";
import { abi as abiMerkle } from "@/ABI/Union/MerkleDistributor2";
import { useWallet } from "@/Wallet";
import PounderInput from "@Pounders/Components/PounderInput.vue";
import SelectZap from "@Pounders/Components/SelectZap.vue";
import { useUnionStore } from "@Pounders/Store";
import type { PounderId, Zap, ZapWithdraw, ZapDeposit } from "@Pounders/Models";
import ModalSlippage from "@Pounders/Components/ModalSlippage.vue";
import ModalCowSwap from "@Pounders/Components/ModalCowSwap.vue";

import cow from "@/Assets/Icons/Tokens/cow.webp";

const { t } = useI18n();

const { pounderId, expanded } = defineProps<{
  pounderId: PounderId;
  expanded: boolean;
}>();

const emit = defineEmits<{
  deposit: [];
  withdraw: [];
}>();

// Refs
const { address } = useWallet();
const config = useConfig();

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

const zapWithdraw = ref<ZapWithdraw | undefined>(undefined);
const zapDeposit = ref<ZapDeposit | undefined>(undefined);

const minAmountOutRef = ref(0);
const minAmountOut = ref(0);

const symbolOutput = ref("");

const pounderStore = computed(() => store.pounders[pounderId]!);
const claim = computed(() => store.claims[pounderId]);
const description = computed(() => t(pounderStore.value.pounder.description));
const state = computed(() => pounderStore.value.state);
const zapsFactories = computed(() => pounderStore.value.zapsFactories);

const showSwapDeposit = ref(false);
const swapDeposit = computed(
  () => pounderStore.value.pounder.swapDeposit ?? null
);

const showSwapWithdraw = ref(false);
const swapWithdraw = computed(
  () => pounderStore.value.pounder.swapWithdraw ?? null
);

/** The total withdrawable balance, including unclaimed amount. */
const withdrawable = computed(() => {
  const { balanceWithdraw, balanceUnclaimed } = state.value;

  return (balanceWithdraw ?? 0n) + (balanceUnclaimed ?? 0n);
});

const depositInput = computed(() => {
  if (!state.value.balanceDeposit) {
    return undefined;
  }

  return deposit.value > state.value.balanceDeposit
    ? state.value.balanceDeposit
    : deposit.value;
});

const withdrawInput = computed((): bigint | undefined => {
  if (!withdrawable.value) {
    return undefined;
  }

  return withdraw.value > withdrawable.value
    ? withdrawable.value
    : withdraw.value;
});

const canDeposit = computed((): boolean => {
  const deposit = depositInput;
  return deposit.value !== undefined && deposit.value > 0n && !depositing.value;
});

const canWithdraw = computed((): boolean => {
  const withdraw = withdrawInput;
  return (
    withdraw.value !== undefined && withdraw.value > 0n && !withdrawing.value
  );
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
  [zapDeposit, address, toRef(() => expanded)],
  async ([, , expanded]) => {
    // Only load when expanded to save RPC resources.
    if (!expanded) {
      return;
    }

    if (zapDeposit.value !== undefined) {
      await store.updateZapDeposit(pounderId, zapDeposit.value);
    }
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

      const host = await useHost();
      minAmountOutRef.value = await zapDeposit.value
        .getMinAmountOut(host, depositInput.value, 0)
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

    await store.updatePounder(pounderId);
    await store.updateBalances(pounderId, address.value);
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
    state.value.balanceWithdraw === undefined
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

      const host = await useHost();
      minAmountOutRef.value = await zapWithdraw.value
        .getMinAmountOut(host, withdrawInput.value, 0)
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

    await store.updatePounder(pounderId);
    await store.updateBalances(pounderId, address.value);

    if (zapDeposit.value) {
      await store.updateZapDeposit(pounderId, zapDeposit.value);
    }

    emit("withdraw");
  });
};

const onClaimAndWithdraw = async (): Promise<void> => {
  const distributor = pounderStore.value.pounder.distributor;
  if (!claim.value || !distributor) {
    return;
  }

  const amount = BigInt(claim.value.amount);

  await tryNotify(async () => {
    if (!claim.value || !address.value) {
      return;
    }

    const args = [
      BigInt(claim.value.index),
      address.value,
      amount,
      claim.value.proof,
    ] as const;

    const hash = await writeContract(config, {
      abi: abiMerkle,
      address: distributor,
      functionName: "claim",
      args,
    });

    await waitForTransactionReceipt(config, { hash });

    store.updateClaim(pounderId);

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
          <SelectZap
            v-if="zapDeposit"
            v-model="zapDeposit"
            :class="{ expanded }"
            :zaps="zapsDeposit"
            @select="onDepositSelect"
          ></SelectZap>

          <div class="buttons">
            <Button
              :value="depositLabel"
              :primary="true"
              :disabled="!canDeposit"
              :chain-id="mainnet.id"
              @click="onDeposit(false)"
            ></Button>

            <Button
              v-if="!!swapDeposit"
              class="swap"
              :chain-id="mainnet.id"
              @click="showSwapDeposit = true"
            >
              <img :src="cow" />
              {{ t("buy", [swapDeposit?.buy ?? "?"]) }}
            </Button>
          </div>
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
          <SelectZap
            v-if="zapWithdraw"
            v-model="zapWithdraw"
            :class="{ expanded }"
            :zaps="zapsWithdraw"
            @select="onWithdrawSelect"
          ></SelectZap>

          <div class="buttons">
            <Button
              :value="withdrawLabel"
              :primary="true"
              :disabled="!canWithdraw"
              :chain-id="mainnet.id"
              @click="onWithdraw(false, false)"
            ></Button>

            <Button
              v-if="!!swapWithdraw"
              class="swap"
              :chain-id="mainnet.id"
              @click="showSwapWithdraw = true"
            >
              <img :src="cow" />
              {{ t("sell", [swapWithdraw?.sell ?? "?"]) }}
            </Button>
          </div>

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

    <div class="description">
      <span class="title">{{ t("information") }}</span>
      <span>{{ description }}</span>
    </div>

    <ModalCowSwap
      :show="showSwapDeposit"
      :swap="swapDeposit"
      @close="showSwapDeposit = false"
    ></ModalCowSwap>

    <ModalCowSwap
      :show="showSwapWithdraw"
      :swap="swapWithdraw"
      @close="showSwapWithdraw = false"
    ></ModalCowSwap>

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

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column;

  margin: 1rem 2rem;
  gap: var(--dashboard-gap);
  border-top: solid 1px var(--c-lvl4);

  > .deposit-and-withdraw {
    display: flex;
    flex-direction: row;
    gap: 2rem;

    @media only screen and (max-width: 1280px) {
      flex-direction: column;
    }

    > .deposit {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
    }

    > .withdraw {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
    }

    .actions {
      display: grid;
      grid-template-columns: 6fr 4fr;
      gap: 1rem;

      @media only screen and (max-width: 1280px) {
        grid-template-columns: 1fr;
      }

      > .select {
        align-self: start;
      }

      > .buttons {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;

        > button {
          justify-content: center;

          img {
            width: 20px;
            height: 20px;
            object-fit: scale-down;
            margin-right: 1ch;
          }
        }

        > .swap {
          background-color: var(--c-lvl2);

          &:hover {
            background-color: var(--c-lvl3);
          }
        }
      }
    }
  }

  > .description {
    margin-top: 1rem;

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
</style>

<i18n lang="yaml" locale="en">
zap-deposit: Deposit
zap-depositing: Depositing...
zap-withdraw: Withdraw
zap-withdrawing: Withdrawing...
claim-rewards-title: Claim Union rewards
claim-first: In order to withdraw the requested amount you first need to claim
  your Union rewards

buy: Buy {0}
sell: Sell {0}

description-ucrv: This pounder stakes cvxCRV single-sidedly on Convex.
  Llama Airforce devs actively choose the highest yielding reward weight option for the staked cvxCRV.
description-ufxs: This pounder stakes cvxFXS single-sidedly on Convex.
description-uprisma: This pounder stakes cvxPRISMA single-sidedly on Convex.
description-ucvx: This pounder stakes pxCVX and compounds the earned bribe rewards for more pxCVX.
description-ubal: This pounder stakes auraBAL on Aura.
description-ufxslp: This pounder stakes cvxFXS/FXS LP tokens on Convex.
  This staking method no longer actively rewarded by Convex; these rewards have been moved to single-sided cvxFXS staking.

information: Information
</i18n>

<i18n lang="yaml" locale="zh">
zap-deposit: 订金
zap-depositing: 订金。。。
zap-withdraw: 提取
zap-withdrawing: 提取。。。
claim-rewards-title: 索取奖励
claim-first: 在提取您要求的金额之前，请先领取您的收益

buy: 购买 {0}
sell: 卖出 {0}

information: 信息
</i18n>

<i18n lang="yaml" locale="fr">
zap-deposit: Déposer
zap-depositing: Déposer...
zap-withdraw: Retirer
zap-withdrawing: Retirer...
claim-rewards-title: Réclamer les récompenses de l'Union
claim-first: Pour retirer le montant demandé, vous devez d'abord réclamer
  vos récompenses de l'Union

buy: Acheter {0}
sell: Vendre {0}

description-ucrv: Ce pounder stake du cvxCRV en unilatéral sur Convex.
  Les développeurs de Llama Airforce sélectionnent activement l'option de récompense offrant le rendement le plus élevé pour le cvxCRV staké.
description-ufxs: Ce pounder stake du cvxFXS en unilatéral sur Convex.
description-uprisma: Ce pounder stake du cvxPRISMA en unilatéral sur Convex.
description-ucvx: Ce pounder stake du pxCVX et compounde les récompenses de pots-de-vin gagnées pour plus de pxCVX.
description-ubal: Ce pounder stake de l'auraBAL sur Aura.
description-ufxslp: Ce pounder stake des tokens cvxFXS/FXS LP sur Convex.
  Cette méthode de staking n'est plus activement récompensée par Convex; les récompenses ont été déplacées vers le staking cvxFXS unilatéral.

information: Informations
</i18n>
