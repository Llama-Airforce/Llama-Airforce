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
    <template #row="{ item: reward }: { item: Row }">
      <TokenIcon :address="reward.address"></TokenIcon>
      <div>{{ reward.symbol }}</div>

      <div class="end">
        <AsyncValue
          :value="reward.amount"
          :precision="4"
          :show-symbol="false"
          type="dollar"
        ></AsyncValue>
      </div>

      <div class="end">
        <AsyncValue
          :value="reward.amountUsd"
          type="dollar"
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.rewards-table {
  --columns-data: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr);

  padding: 0;

  &.can-select {
    --columns-data: 26px 2fr minmax(4rem, 1fr) minmax(4rem, 1fr) 3rem;
  }

  img {
    aspect-ratio: 1;
    max-width: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
}
</style>
