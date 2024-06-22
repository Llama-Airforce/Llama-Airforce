<template>
  <DataTable
    class="datatable-rewards"
    columns-data="rewards-columns-data"
    :class="{ 'can-select': canSelect }"
    :header="false"
    :columns
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

      <div v-if="canSelect">
        <Checkbox
          :model-value="selected.includes(reward)"
          @update:model-value="emit('select', reward)"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Reward } from "@LAF/Pages/Pirex/Services";

type Row = Reward;

// Props
interface Props {
  rewards: Reward[];
  canSelect?: boolean;
  selected?: Reward[];
}

const { rewards, canSelect = false, selected = [] } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  select: [rewards: Reward];
}>();

const columns = computed(() =>
  canSelect
    ? ["", "Reward", "Amount", "Value", ""]
    : ["", "Reward", "Amount", "Value"]
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-rewards {
  padding: 0;

  &.can-select {
    ::v-deep(.rewards-columns-data) {
      grid-template-columns: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr) 3rem;
    }
  }

  ::v-deep(.rewards-columns-data) {
    display: grid;
    grid-template-columns: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr);

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4) {
      justify-content: end;
    }

    div:nth-child(5) {
      justify-self: center;
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
