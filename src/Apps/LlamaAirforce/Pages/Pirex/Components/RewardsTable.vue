<script setup lang="ts">
import { type Reward } from "@LAF/Pages/Pirex/Services";

const {
  rewards,
  canSelect = false,
  selected = [],
} = defineProps<{
  rewards: Reward[];
  canSelect?: boolean;
  selected?: Reward[];
}>();

const emit = defineEmits<{
  select: [rewards: Reward];
}>();

const columns = computed(() => [
  "",
  { label: "Reward", align: "end" } as const,
  { label: "Amount", align: "end" } as const,
  { label: "Value", align: "end" } as const,
  ...(canSelect ? [""] : []),
]);

function isSelected(reward: Reward) {
  const rewardJson = JSON.stringify(reward);

  return selected.map((x) => JSON.stringify(x)).includes(rewardJson);
}
</script>

<template>
  <Table
    class="rewards-table"
    :class="{ 'can-select': canSelect }"
    :columns
    :rows="rewards"
    @selected="emit('select', $event)"
  >
    <template #row="{ item: reward }">
      <TokenIcon :address="reward.address"></TokenIcon>
      <div>{{ reward.symbol }}</div>

      <div class="end">
        <AsyncValue
          type="dollar"
          :value="reward.amount"
          :precision="4"
          :show-symbol="false"
        ></AsyncValue>
      </div>

      <div class="end">
        <AsyncValue
          type="dollar"
          :value="reward.amountUsd"
        ></AsyncValue>
      </div>

      <div
        v-if="canSelect"
        class="center"
        @click.stop
      >
        <Checkbox
          :model-value="isSelected(reward)"
          @update:model-value="emit('select', reward)"
        />
      </div>
    </template>
  </Table>
</template>

<style scoped>
.rewards-table {
  --columns-data: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr);

  padding: 0;

  &.can-select {
    --columns-data: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr) 3rem;
  }
}
</style>
