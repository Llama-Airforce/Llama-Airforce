<template>
  <div class="colors">
    <DataTable
      class="datatable-colors"
      columns-header="1fr"
      columns-data="colors-columns-data"
      :rows="colors"
      :columns="['Variable', 'Value', 'Preview']"
    >
      <template #header-content>
        <div class="title">Colors</div>
      </template>

      <template #row="props: { item: Color }">
        <div>{{ props.item.variable }}</div>
        <div>{{ props.item.value }}</div>
        <div class="preview-container">
          <div
            class="preview"
            :style="{ 'background-color': props.item.value }"
          ></div>

          <span
            class="preview-text"
            :style="{ color: props.item.value }"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ColorsLAFDark } from "@/Styles/Themes/LAF/Dark";

type Color = {
  variable: string;
  value: string;
};

const colors: Color[] = [
  // Base colors
  { variable: "var(--c-blue)", value: ColorsLAFDark.blue },
  { variable: "var(--c-yellow)", value: ColorsLAFDark.yellow },
  { variable: "var(--c-green)", value: ColorsLAFDark.green },
  { variable: "var(--c-red)", value: ColorsLAFDark.red },
  { variable: "var(--c-purple)", value: ColorsLAFDark.purple },

  // Background and levels
  { variable: "var(--c-lvl0)", value: ColorsLAFDark.backgroundColor },
  { variable: "var(--c-lvl1)", value: ColorsLAFDark.level1 },
  { variable: "var(--c-lvl2)", value: ColorsLAFDark.level2 },
  { variable: "var(--c-lvl3)", value: ColorsLAFDark.level3 },
  { variable: "var(--c-lvl4)", value: ColorsLAFDark.level4 },
  { variable: "var(--c-lvl5)", value: ColorsLAFDark.level5 },
  { variable: "var(--c-lvl6)", value: ColorsLAFDark.level6 },

  // Text
  { variable: "var(--c-text)", value: ColorsLAFDark.text },
];
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("colors");

.datatable-colors {
  ::v-deep(.colors-columns-data) {
    display: grid;
    grid-template-columns: 0.2fr 0.2fr 0.6fr;

    .preview-container {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;

      .preview {
        width: 50%;
        height: 50%;
        border-radius: var(--border-radius);
      }
    }
  }
}
</style>
