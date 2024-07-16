<template>
  <DataTable
    class="datatable-redemptions-init"
    columns-data="redemptions-columns-data"
    :header="false"
    :columns="['Unlock Date', 'CVX Available', 'Early Unlock Fee', '']"
    :rows="redemptions"
    @selected="selected = $event.lockIndex"
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

      <div>
        <RadioButton
          v-model="selected"
          name="redemption"
          :values
          :value="redemption.lockIndex"
        />
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

// Emits
const emit = defineEmits<{
  redemption: [redemption: Redemption];
}>();

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

// Radio button control
const selected: Ref<number | undefined> = ref(undefined);
const values = computed(() => redemptions.map((x) => x.lockIndex));

watch(selected, (newRedemption) => {
  const redemption = redemptions.find((x) => x.lockIndex === newRedemption);

  if (redemption) {
    return emit("redemption", redemption);
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions-init {
  padding: 0;

  :deep(.redemptions-columns-data) {
    grid-template-columns: 1fr 1fr 1fr 3rem;

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-self: end;
    }

    div:nth-child(4) {
      justify-self: center;
    }

    div:nth-child(2) {
      font-weight: bold;
    }
  }
}
</style>
