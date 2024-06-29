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
          :disabled="true"
        ></Button>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type RedemptionPending } from "@LAF/Pages/Pirex/Services";

type Row = RedemptionPending;

// Props
interface Props {
  redemptions: RedemptionPending[];
}

const { redemptions } = defineProps<Props>();

// Formatters
function date(redemption: RedemptionPending) {
  const date = new Date(Number(redemption.tokenId) * 1000); // Convert seconds to milliseconds
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

  ::v-deep(.redemptions-columns-data) {
    display: grid;
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
