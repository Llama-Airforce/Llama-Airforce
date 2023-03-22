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
import { Colors } from "@/Util";

type Color = {
  variable: string;
  value: string;
};

const colors: Color[] = [
  {
    variable: "$background-color",
    value: Colors.backgroundColor,
  },
  {
    variable: "$level1-color",
    value: Colors.level1,
  },
  {
    variable: "$level2-color",
    value: Colors.level2,
  },
  {
    variable: "$level3-color",
    value: Colors.level3,
  },
  {
    variable: "$level4-color",
    value: Colors.level4,
  },
  {
    variable: "$level5-color",
    value: Colors.level5,
  },
  {
    variable: "$level6-color",
    value: Colors.level6,
  },
  {
    variable: "$text",
    value: Colors.text,
  },
  {
    variable: "var(--c-red)",
    value: Colors.red,
  },
  {
    variable: "var(--c-green)",
    value: Colors.green,
  },
  {
    variable: "var(--c-blue)",
    value: Colors.blue,
  },
  {
    variable: "var(--c-yellow)",
    value: Colors.yellow,
  },
  {
    variable: "var(--c-purple)",
    value: Colors.purple,
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
