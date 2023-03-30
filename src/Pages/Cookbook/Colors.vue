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
    variable: "var(--c-lvl0)",
    value: Colors.backgroundColor,
  },
  {
    variable: "var(--c-lvl1)",
    value: Colors.level1,
  },
  {
    variable: "var(--c-lvl2)",
    value: Colors.level2,
  },
  {
    variable: "var(--c-lvl3)",
    value: Colors.level3,
  },
  {
    variable: "var(--c-lvl4)",
    value: Colors.level4,
  },
  {
    variable: "var(--c-lvl5)",
    value: Colors.level5,
  },
  {
    variable: "var(--c-lvl6)",
    value: Colors.level6,
  },
  {
    variable: "var(--c-text)",
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
