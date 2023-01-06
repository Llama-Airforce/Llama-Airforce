<template>
  <div class="colors">
    <div class="dashboard">
      <DataTable
        class="datatable-colors"
        columns-header="1fr"
        columns-data="colors-columns-data"
        :rows="colors"
        :columns="['Variable', 'Value', 'Preview']"
      >
        <template #header-title>
          <div>Colors</div>
        </template>

        <template #row="props: { item: Color }">
          <div>{{ props.item.variable }}</div>
          <div>{{ props.item.value }}</div>
          <div
            class="preview"
            :style="{ 'background-color': props.item.value }"
          ></div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataTable } from "@/Framework";

type Color = {
  variable: string;
  value: string;
};

const colors: Color[] = [
  {
    variable: "$background-color",
    value: "#18181b",
  },
  {
    variable: "$level1-color",
    value: "#212124",
  },
  {
    variable: "$level2-color",
    value: "#27272a",
  },
  {
    variable: "$level3-color",
    value: "#303034",
  },
  {
    variable: "$level4-color",
    value: "#35353b",
  },
  {
    variable: "$level5-color",
    value: "#71717a",
  },
  {
    variable: "$level6-color",
    value: "#aea8af",
  },
  {
    variable: "$text",
    value: "#fafafa",
  },
  {
    variable: "$red",
    value: "rgb(255, 87, 87)",
  },
  {
    variable: "$green",
    value: "rgb(126, 217, 87)",
  },
  {
    variable: "$blue",
    value: "rgb(32, 129, 240)",
  },
  {
    variable: "$yellow",
    value: "rgb(255, 204, 0)",
  },
  {
    variable: "$purple",
    value: "rgb(140, 82, 255)",
  },
];
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("colors");

.datatable-colors {
  ::v-deep(.colors-columns-data) {
    display: grid;
    grid-template-columns: 0.3fr 0.2fr 0.5fr;

    .preview {
      height: 33%;
    }
  }
}
</style>
