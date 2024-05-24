<template>
  <DataTable
    class="datatable-rewards"
    columns-data="rewards-columns-data"
    :header="false"
    :columns="['', 'Reward', 'Amount', 'Value']"
    :rows="rewards"
  >
    <template #row="{ item: reward }: { item: Row }">
      <TokenIcon :address="reward.address"></TokenIcon>
      <div>{{ reward.symbol }}</div>

      <div class="number">
        <AsyncValue
          :value="reward.amount"
          :precision="4"
          :show-symbol="false"
          type="dollar"
        ></AsyncValue>
      </div>

      <div class="number">
        <AsyncValue
          :value="reward.amountUsd"
          type="dollar"
        ></AsyncValue>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Reward } from "@LAF/Pages/Pirex/Models";

type Row = Reward;

// Props
interface Props {
  rewards: Reward[];
}

const { rewards } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-rewards {
  padding: 0;

  ::v-deep(.rewards-columns-data) {
    display: grid;
    grid-template-columns: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr);

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
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
