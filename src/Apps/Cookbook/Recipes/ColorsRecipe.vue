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

<template>
  <div class="dashboard">
    <Card title="Colors">
      <Table
        class="colors-table"
        :rows="colors"
        :columns="['Variable', 'Value', 'Preview']"
      >
        <template #row="{ item }">
          <div>{{ item.variable }}</div>
          <div>{{ item.value }}</div>
          <div class="preview-container">
            <div
              class="preview"
              :style="{ 'background-color': item.value }"
            ></div>

            <span
              class="preview-text"
              :style="{ color: item.value }"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </span>
          </div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.colors-table {
  --columns-data: 0.2fr 0.2fr 0.6fr;

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
</style>
