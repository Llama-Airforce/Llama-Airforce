<script setup lang="ts">
import { mainnet } from "viem/chains";
import { type Address } from "@/Framework/Address";
import { useWallet } from "@/Wallet";
import { abi as abiLPxCvx } from "@/ABI/Union/PirexLPxCvx";
import { abi as abiCurve2 } from "@/ABI/Curve/CurveV2FactoryPool";

const { t } = useI18n();

const emit = defineEmits<{
  close: [];
  yes: [newMinAmountOut: number];
  no: [];
}>();

// Refs
const submitLabel = computed(() => {
  if (isApproving.value) {
    return "Approving...";
  } else if (isSwapping.value) {
    return "Swapping...";
  }

  return needsApprove.value ? "Approve" : "Swap";
});

// Input
const { address } = useWallet();

const tokens = [
  {
    address: PxCvxAddress as Address,
    symbol: "pxCVX",
  },
  {
    address: CvxAddress as Address,
    symbol: "CVX",
  },
];
const token = ref(tokens[0]);
const swapInfo = computed(() => {
  const from = tokens[token.value.symbol === "pxCVX" ? 0 : 1];
  const to = tokens[token.value.symbol === "pxCVX" ? 1 : 0];

  return { from, to };
});

const { data: balanceInfo, refetch: refetchBalance } = useBalance({
  address,
  token: computed(() => swapInfo.value.from.address),
});
const balance = computed(() => balanceInfo.value?.value ?? 0n);
const balanceNum = computed(() => bigNumToNumber(balance.value, 18n));

const balanceSwap: Ref<number | string | null> = ref(null);
const balanceSwapSafe = computed(() =>
  typeof balanceSwap.value === "number" ? balanceSwap.value : 0
);
const balanceSwapBigInt = computed(() =>
  numToBigNumber(balanceSwapSafe.value, 18n)
);

const canSwap = computed(
  () =>
    balanceSwapSafe.value > 0 &&
    balanceSwapSafe.value <= balanceNum.value &&
    minAmountOut.value > 0n
);

// Slippage
const slippage = ref(0.03);
const minAmountOutSafe = computed(
  () => balanceSwapSafe.value * (1 - slippage.value)
);
const minAmountOut = computed(() =>
  numToBigNumber(minAmountOutSafe.value, 18n)
);

const getDyInput = computed(() =>
  balanceSwapSafe.value < 100
    ? numToBigNumber(100, 18n)
    : balanceSwapBigInt.value
);

const { data: getDy } = useReadContract({
  abi: abiCurve2,
  address: LPxCvxFactoryAddress,
  functionName: "get_dy",
  args: computed(() => {
    const indexFrom = swapInfo.value.from.symbol === "pxCVX" ? 1n : 0n;
    const indexTo = indexFrom === 1n ? 0n : 1n;

    return [indexFrom, indexTo, getDyInput.value] as const;
  }),
});

const discount = computed(() => {
  const amount = bigNumToNumber(getDyInput.value, 18n);
  const expected = bigNumToNumber(getDy.value ?? 0n, 18n);

  return (100 * expected) / amount;
});

// Approval
const { needsApprove, approve, isApproving } = useApprove(
  computed(() => swapInfo.value.from.address),
  address,
  LPxCvxAddress,
  balanceSwapBigInt,
  { maxApprove: false }
);

function onSubmit() {
  if (needsApprove.value) {
    approve();
  } else {
    swap();
  }
}

// Swap
const { execute: swap, isExecuting: isSwapping } = useExecuteContract(
  (writeContract) => {
    const indexFrom = swapInfo.value.from.symbol === "pxCVX" ? 1 : 0;
    const indexTo = indexFrom === 1 ? 0 : 1;

    writeContract({
      abi: abiLPxCvx,
      address: LPxCvxAddress,
      functionName: "swap",
      args: [
        indexFrom,
        balanceSwapBigInt.value,
        minAmountOut.value,
        BigInt(indexFrom),
        BigInt(indexTo),
      ] as const,
    });
  },
  {
    successMessage: "You've succesfully swapped!",
    onSuccess: () => {
      void refetchBalance();
      balanceSwap.value = null;
    },
  }
);
</script>

<template>
  <Modal @close="emit('close')">
    <Card title="Swap">
      <div class="swap-body">
        <div class="input">
          <SelectToken
            v-model="token"
            class="token-select"
            :tokens
            @select="token = $event"
          ></SelectToken>

          <InputNumber
            v-model="balanceSwap"
            :min="0"
            :max="Infinity"
            :placeholder="balanceNum"
          ></InputNumber>

          <a @click="balanceSwap = balanceNum">Max</a>
        </div>

        <h3>Slippage</h3>
        <div class="slippage">
          <div
            style="grid-area: info"
            class="info"
          >
            <div class="explanation">{{ t("slippage-info") }}</div>
            <div class="discount">
              <div class="title">Current discount</div>

              <AsyncValue
                type="percentage"
                :value="discount"
              ></AsyncValue>
            </div>
          </div>

          <span style="grid-area: label1">{{ t("percentage") }}</span>

          <Slider
            v-model="slippage"
            style="grid-area: slider"
            :min="0.001"
            :max="0.2"
            :step="0.001"
          ></Slider>

          <span style="grid-area: percentage">
            {{ (Math.round(slippage * 100 * 1000) / 1000).toFixed(2) }}%
          </span>

          <span style="grid-area: label2">{{ t("min-amount") }}</span>

          <InputNumber
            v-model="minAmountOutSafe"
            style="grid-area: input"
            disabled
            :min="0"
            :max="Infinity"
          ></InputNumber>

          <span style="grid-area: symbol">{{ swapInfo.to.symbol }}</span>
        </div>

        <Button
          class="primary"
          :disabled="!canSwap || isApproving || isSwapping"
          :chain-id="mainnet.id"
          @click="onSubmit"
        >
          {{ submitLabel }}
        </Button>
      </div>
    </Card>
  </Modal>
</template>

<style scoped>
.swap-body {
  width: 33vw;
  max-height: 75dvh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;

  @media only screen and (max-width: 1280px) {
    width: 80vw;
  }

  > h3 {
    margin: 0;
    margin-bottom: -1.5rem;
  }

  > .slippage {
    display: grid;
    gap: 1rem;
    row-gap: 2rem;
    align-items: center;

    grid-template-columns: auto minmax(4rem, 1fr) 6ch;
    grid-template-areas:
      "info info info"
      "label1 slider percentage"
      "label2 input symbol";

    > .info {
      display: grid;
      grid-template-columns: 3fr 1fr;
      gap: 1rem;

      @media only screen and (max-width: 1280px) {
        display: flex;
        flex-direction: column;
      }

      > .explanation {
        color: #a1a1aa;
        text-wrap: pretty;
      }

      > .discount {
        display: grid;
        grid-template-rows: auto 1fr;
        align-items: center;
        justify-items: center;

        > .title {
          font-size: 1rem;
          font-weight: bolder;
        }

        > .async-value {
          font-size: 1.75rem;
          font-weight: bolder;
        }
      }
    }
  }

  > .input {
    display: grid;
    grid-template-columns: 20ch 1fr 6ch;
    gap: 1rem;
    align-items: center;

    @media only screen and (max-width: 500px) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    a {
      cursor: pointer;
      user-select: none;
      justify-self: center;
    }
  }

  > button {
    align-self: end;
    width: 5rem;
    justify-content: center;
  }
}
</style>

<i18n lang="yaml" locale="en">
price-modal-title: Price control
percentage: Percentage
min-amount: Min Amount
no-zero: Zero min amount not allowed
slippage-info:
  Price control is a safeguard against excessive slippage or sandwich attacks.
  By setting a minimum percentage for your input, you establish a lower limit for your returns.
  If you encounter a slippage error, the value you set might be too low.
  A slight increase of one or two percent could help, but don't make it too high to ensure your protection.
</i18n>

<i18n lang="yaml" locale="zh">
price-modal-title: 价格控制
percentage: 百分比
min-amount: 最小数量
no-zero: 最小数量不能为0
slippage-info: 价格控制是防止过度滑点或夹心层攻击的一种保障措施。通过设定输入的最低百分比，可以为收益设定一个下限。如果您遇到滑点错误，您设定的值可能太低。稍微增加一到两个百分点可能会有帮助，但不要太高，以确保您的保护。
</i18n>

<i18n lang="yaml" locale="fr">
price-modal-title: Contrôle des prix
percentage: Pourcentage
min-amount: Montant minimum
no-zero: Montant minimum zéro non autorisé
slippage-info:
  Le contrôle des prix est une protection contre les dérapages excessifs ou les attaques en sandwich.
  En fixant un pourcentage minimum pour vos intrants, vous établissez une limite inférieure pour vos retours.
  Si vous rencontrez une erreur de dérapage, la valeur que vous avez fixée est peut-être trop basse.
  Une légère augmentation d'un ou deux pour cent pourrait être utile, mais ne la fixez pas trop haut pour assurer votre protection.
</i18n>
