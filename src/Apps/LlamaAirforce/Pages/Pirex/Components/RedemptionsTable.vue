<template>
  <DataTable
    class="datatable-redemptions"
    columns-data="redemptions-columns-data"
    :header="false"
    :columns="['', 'yolo']"
    :rows="redemptions"
  >
    <template #row="{ item: redemption }: { item: Row }">
      <div>{{ redemption.symbol }}</div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { type Redemption } from "@LAF/Pages/Pirex/Models";

type Row = Redemption;

// Props
interface Props {
  redemptions: Redemption[];
}

const { redemptions } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-redemptions {
  padding: 0;

  ::v-deep(.redemptions-columns-data) {
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
