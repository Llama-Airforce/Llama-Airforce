<template>
  <DataTable
    class="datatable-redemptions-init"
    columns-data="redemptions-columns-data"
    :header="false"
    :columns="['Unlock Date', 'CVX Available', 'Early Unlock Fee']"
    :rows="redemptions"
  >
    <template #row="{ item: redemption }: { item: Row }">
      <div>{{ formatDate(redemption.unlockTime) }}</div>

      <div>{{ formatCvxAvailable(redemption.cvxAvailable) }}</div>

      <div>
        <AsyncValue
          :value="redemption.fee"
          type="percentage"
        ></AsyncValue>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Redemption } from "@LAF/Pages/Pirex/Services";

type Row = Redemption;

// Props
interface Props {
  redemptions: Redemption[];
}

const { redemptions } = defineProps<Props>();

// Formatters
function formatDate(unlockTime: number): string {
  const date = new Date(unlockTime * 1000); // Convert seconds to milliseconds
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCvxAvailable(value: number): string {
  return Number(value.toFixed(value > 100 ? 0 : 2)).toLocaleString();
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions-init {
  padding: 0;

  ::v-deep(.redemptions-columns-data) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-self: end;
    }

    div:nth-child(2) {
      font-weight: bold;
    }
  }
}
</style>