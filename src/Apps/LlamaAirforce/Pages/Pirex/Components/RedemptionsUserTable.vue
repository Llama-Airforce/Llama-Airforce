<template>
  <DataTable
    class="datatable-redemptions-user"
    columns-data="redemptions-columns-data"
    :header="false"
    :columns="['Unlock', 'Amount', '']"
    :rows="redemptions"
  >
    <template #row="{ item: redemption }: { item: Row }">
      <div>{{ date(redemption) }}</div>

      <div>
        <AsyncValue
          :value="balance(redemption)"
          :precision="4"
          :show-symbol="false"
          type="dollar"
        ></AsyncValue>
      </div>

      <div>
        <Button
          value="Redeem"
          :web3="true"
          :disabled="redeeming || !canRedeem(redemption)"
          :primary="true"
          @click="redeem(redemption)"
        ></Button>
      </div>
    </template>
  </DataTable>
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

.datatable-redemptions-user {
  padding: 0;

  :deep(.redemptions-columns-data) {
    grid-template-columns: minmax(4rem, 1fr) minmax(4rem, 1fr) 6rem;

    // Right adjust number columns.
    div:nth-child(1),
    div:nth-child(2) {
      justify-self: end;
    }

    div:nth-child(3) {
      justify-self: end;
    }
  }

  img {
    aspect-ratio: 1;
    max-width: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
}
</style>
