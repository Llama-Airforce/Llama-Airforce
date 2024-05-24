<template>
  <DataTable
    class="datatable-stakes"
    columns-data="stakes-columns-data"
    :header="false"
    :columns="['', 'yolo']"
    :rows="stakes"
  >
    <template #row="{ item: stake }: { item: Row }">
      <div>{{ stake.symbol }}</div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Staking } from "@LAF/Pages/Pirex/Models";

type Row = Staking;

// Props
interface Props {
  stakes: Staking[];
}

const { stakes } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-stakes {
  padding: 0;

  ::v-deep(.stakes-columns-data) {
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
