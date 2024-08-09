<template>
  <Table
    class="redemptions-user-table"
    :columns="[
      { label: 'Unlock', align: 'end' },
      { label: 'Amount', align: 'end' },
      '',
    ]"
    :rows="redemptions"
  >
    <template #row="{ item: redemption }: { item: Row }">
      <div class="end">{{ date(redemption) }}</div>

      <div class="end">
        <AsyncValue
          :value="balance(redemption)"
          :precision="4"
          :show-symbol="false"
          type="dollar"
        ></AsyncValue>
      </div>

      <div class="end">
        <Button
          value="Redeem"
          :web3="true"
          :disabled="redeeming || !canRedeem(redemption)"
          :primary="true"
          @click="redeem(redemption)"
        ></Button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { abi } from "@/ABI/Union/Pirex";
import { useWallet } from "@/Wallet";
import { type RedemptionPending } from "@LAF/Pages/Pirex/Services";

type Row = RedemptionPending;

// Props
interface Props {
  redemptions: RedemptionPending[];
}

const { redemptions } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  redeemed: [redemption: RedemptionPending];
}>();

// Redemption
const { address } = useWallet();

function redemptionDate(redemption: RedemptionPending) {
  return new Date(Number(redemption.tokenId) * 1000); // Convert seconds to milliseconds
}

function canRedeem(redemption: RedemptionPending) {
  return !!address.value && redemptionDate(redemption) <= new Date(Date.now());
}

let redemptionRedeeming: RedemptionPending | null = null;
const { execute: redeem, isExecuting: redeeming } = useExecuteContract(
  (writeContract, redemption: RedemptionPending) => {
    redemptionRedeeming = redemption;

    writeContract({
      address: PirexCvxAddress,
      abi,
      functionName: "redeem",
      args: [
        [redemption.tokenId],
        [redemption.balance],
        address.value!,
      ] as const,
    });
  },
  {
    successMessage: `Successfully redeemed epoch`,
    onSuccess: () => {
      emit("redeemed", redemptionRedeeming!);
      redemptionRedeeming = null;
    },
    onError: () => {
      redemptionRedeeming = null;
    },
  }
);

// Formatters
function date(redemption: RedemptionPending) {
  const date = redemptionDate(redemption);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function balance(redemption: RedemptionPending) {
  return bigNumToNumber(redemption.balance, 18n);
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemptions-user-table {
  --columns-data: minmax(4rem, 1fr) minmax(4rem, 1fr) 6rem;
  padding: 0;

  img {
    aspect-ratio: 1;
    max-width: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
}
</style>
