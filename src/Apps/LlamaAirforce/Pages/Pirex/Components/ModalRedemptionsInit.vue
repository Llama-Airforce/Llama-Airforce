<script setup lang="ts">
import { mainnet } from "viem/chains";
import { useWallet } from "@/Wallet";
import { abi as abiVlCvx } from "@/ABI/Convex/CvxLockerV2";
import { abi as abiPirex } from "@/ABI/Union/Pirex";
import RedemptionsTableInit from "@LAF/Pages/Pirex/Components/RedemptionsInitTable.vue";
import type { Redemption } from "@LAF/Pages/Pirex/Services";

const emit = defineEmits<{
  close: [];
}>();

// Refs
const submitLabel = computed(() => {
  if (isApproving.value) {
    return "Approving...";
  } else if (isRedeeming.value) {
    return "Redeeming...";
  }

  return needsApprove.value ? "Approve" : "Redeem";
});

// Redemptions
const { data: maxFee } = useReadContract({
  abi: abiPirex,
  address: PirexCvxAddress,
  functionName: "fees",
  args: [1],
});

const { data: minFee } = useReadContract({
  abi: abiPirex,
  address: PirexCvxAddress,
  functionName: "fees",
  args: [2],
});

const { data: maxRedemptionTime } = useReadContract({
  abi: abiPirex,
  address: PirexCvxAddress,
  functionName: "MAX_REDEMPTION_TIME",
});

const { data: lockData, refetch: refetchLockData } = useReadContract({
  abi: abiVlCvx,
  address: VlCvxAddress,
  functionName: "lockedBalances",
  args: [PirexCvxAddress],
});

const feeDenominator = 1000000;
function getFeeForUnlockTime(unlockTime: number) {
  if (!minFee.value || !maxFee.value || !maxRedemptionTime.value) {
    return 0;
  }

  const now = Date.now() / 1000;

  return (
    ((maxFee.value -
      ((maxFee.value - minFee.value) * (unlockTime - now)) /
        maxRedemptionTime.value) /
      feeDenominator) *
    100
  );
}

const config = useConfig();
const redemptions = computedAsync(async () => {
  if (!lockData.value) {
    return [];
  }

  const locks = lockData.value[3];
  const redemptionData = locks.map(
    async ({ amount, unlockTime }, lockIndex) => {
      const fee = getFeeForUnlockTime(unlockTime);

      const redemptionsForUnlock = await readContract(config, {
        abi: abiPirex,
        address: PirexCvxAddress,
        functionName: "redemptions",
        args: [BigInt(unlockTime)],
      });

      const cvxAvailable = bigNumToNumber(amount - redemptionsForUnlock, 18n);

      return {
        lockIndex,
        unlockTime,
        cvxAvailable,
        fee,
      } as Redemption;
    }
  );

  return Promise.all(redemptionData);
}, []);

// Input
const pxCvxAddress = PxCvxAddress;
const { address } = useWallet();

const { data: balanceInfo, refetch: refetchBalance } = useBalance({
  address,
  token: PxCvxAddress,
});
const balance = computed(() => balanceInfo.value?.value ?? 0n);
const balanceNum = computed(() => bigNumToNumber(balance.value, 18n));

const balanceRedeem: Ref<number | string | null> = ref(null);
const balanceRedeemSafe = computed(() =>
  typeof balanceRedeem.value === "number" ? balanceRedeem.value : 0
);
const balanceRedeemBigInt = computed(() =>
  numToBigNumber(balanceRedeemSafe.value, 18n)
);

const canRedeem = computed(
  () =>
    balanceRedeemSafe.value > 0 &&
    balanceRedeemSafe.value <= balanceNum.value &&
    balanceRedeemSafe.value <= (redemption.value?.cvxAvailable ?? 0)
);

// Approval
const { needsApprove, approve, isApproving } = useApprove(
  PxCvxAddress,
  address,
  PirexCvxAddress,
  balanceRedeemBigInt,
  { maxApprove: false }
);

function onSubmit() {
  if (needsApprove.value) {
    approve();
  } else {
    redeem();
  }
}

// Redemption
const redemption: Ref<Redemption | undefined> = ref(undefined);

const { execute: redeem, isExecuting: isRedeeming } = useExecuteContract(
  (writeContract) => {
    writeContract({
      abi: abiPirex,
      address: PirexCvxAddress,
      functionName: "initiateRedemptions",
      args: [
        [BigInt(redemption.value!.lockIndex)],
        1,
        [balanceRedeemBigInt.value],
        address.value!,
      ] as const,
    });
  },
  {
    successMessage: "You've succesfully redeemed pxCVX!",
    onSuccess: () => {
      void refetchLockData();
      void refetchBalance();
      balanceRedeem.value = null;
    },
  }
);
</script>

<template>
  <Modal @close="emit('close')">
    <Card title="Pirex Convex Redemptions">
      <div class="redemptions-init-body">
        <RedemptionsTableInit
          class="redemptions-init-table"
          :redemptions
          @redemption="redemption = $event"
        />

        <div class="input">
          <TokenIcon :address="pxCvxAddress" />

          <div class="symbol">pxCVX</div>

          <InputNumber
            v-model="balanceRedeem"
            :min="0"
            :max="Infinity"
            :placeholder="balanceNum"
          />

          <a @click="balanceRedeem = balanceNum">Max</a>

          <Button
            class="primary"
            :disabled="!canRedeem || isApproving || isRedeeming"
            :chain-id="mainnet.id"
            @click="onSubmit"
          >
            {{ submitLabel }}
          </Button>
        </div>
      </div>
    </Card>
  </Modal>
</template>

<style>
.modal:has(.redemptions-init-table) {
  .modal-popup {
    position: absolute;
    top: 5rem;
  }
}
</style>

<style scoped>
.redemptions-init-body {
  width: 33vw;
  max-height: 75dvh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;

  @media only screen and (max-width: 1280px) {
    width: 90vw;
  }

  .redemptions-init-table {
    max-height: 500px;
    overflow-y: auto;
  }

  .input {
    display: grid;
    grid-template-columns: 40px auto 1fr auto auto;
    gap: 1rem;
    align-items: center;

    @media only screen and (max-width: 500px) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    img {
      @media only screen and (max-width: 500px) {
        display: none;
      }
    }

    > .symbol {
      font-size: 1rem;
      font-weight: bold;
    }

    a {
      cursor: pointer;
      user-select: none;
      margin-right: 1rem;

      @media only screen and (max-width: 500px) {
        display: none;
      }
    }

    button {
      justify-self: end;
      width: 5rem;
      justify-content: center;
    }
  }
}
</style>
