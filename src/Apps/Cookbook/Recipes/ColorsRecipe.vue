<script setup lang="ts">
import { colors as themeColors } from "@/Styles/ChartTheme";

type Color = {
  variable: string;
  value: string;
};

const colors: Color[] = [
  // Base colors
  { variable: "var(--c-blue)", value: themeColors.value.blue },
  { variable: "var(--c-yellow)", value: themeColors.value.yellow },
  { variable: "var(--c-green)", value: themeColors.value.green },
  { variable: "var(--c-red)", value: themeColors.value.red },
  { variable: "var(--c-purple)", value: themeColors.value.purple },

  // Background and levels
  { variable: "var(--c-lvl0)", value: themeColors.value.backgroundColor },
  { variable: "var(--c-lvl1)", value: themeColors.value.level1 },
  { variable: "var(--c-lvl2)", value: themeColors.value.level2 },
  { variable: "var(--c-lvl3)", value: themeColors.value.level3 },
  { variable: "var(--c-lvl4)", value: themeColors.value.level4 },
  { variable: "var(--c-lvl5)", value: themeColors.value.level5 },
  { variable: "var(--c-lvl6)", value: themeColors.value.level6 },

  // Text
  { variable: "var(--c-text)", value: themeColors.value.text },
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

<style scoped>
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
