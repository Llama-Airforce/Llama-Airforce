<template>
  <Modal @close="emit('close')">
    <Card title="Pirex Convex Redemptions">
      <div class="redemptions-init-body">
        <RedemptionsTableInit
          class="redemptions-init-table"
          :redemptions
        ></RedemptionsTableInit>
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
import { abi as abiVlCvx } from "@/ABI/Convex/CvxLockerV2";
import { abi as abiPirex } from "@/ABI/Union/Pirex";
import RedemptionsTableInit from "@LAF/Pages/Pirex/Components/RedemptionsInitTable.vue";
import { type Redemption } from "@LAF/Pages/Pirex/Services";

// Emits
const emit = defineEmits<{
  close: [];
}>();

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

const { data: lockData } = useReadContract({
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
});
</script>

<style lang="scss">
.modal:has(.redemptions-init-table) {
  .modal-popup {
    position: absolute;
    top: 5rem;
  }
}
</style>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-init-body {
  width: 25vw;
  max-height: 75dvh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  @media only screen and (max-width: 1280px) {
    width: 80vw;
  }

  .redemptions-init-table {
    max-height: 500px;
  }
}
</style>
