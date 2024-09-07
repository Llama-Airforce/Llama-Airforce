<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { getColors } from "@/Styles/Themes/PM";
import { type ThemeId } from "@PM/Models/ThemeId";
import { useSettingsStore } from "@PM/Stores";

const STORAGE_THEME = "theme";

type ThemeDescription = {
  id: ThemeId;
  colors: ReturnType<typeof getColors>;
};

const storeSettings = useSettingsStore();

const themes: ThemeDescription[] = [
  { id: "dark", colors: getColors("dark", storeSettings.flavor) },
  { id: "light", colors: getColors("light", storeSettings.flavor) },
];

// Refs
const browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = browserDark ? "dark" : "light";

const theme = useStorage<ThemeDescription>(
  STORAGE_THEME,
  themes.find((t) => t.id === defaultTheme) ?? themes[0],
  undefined,
  {
    serializer: {
      read: (v: string) => themes.find((t) => t.id === v) ?? themes[0],
      write: (v: ThemeDescription) => v.id,
    },
  }
);

// Hooks
onMounted(() => {
  onThemeSelect(theme.value);
});

// Select
const onThemeSelect = (option: ThemeDescription) => {
  theme.value = option;

  window.document.documentElement.setAttribute("data-theme", option.id);
  storeSettings.themeId = option.id;
};
</script>

<template>
  <Select
    class="direction-up"
    :options="themes.map((x) => x)"
    :selected="theme"
    @input="onThemeSelect"
  >
    <template #item="{ item }">
      <div class="theme">
        <div class="label">{{ item.id }}</div>
        <div class="colors">
          <div
            class="color"
            :style="{ 'background-color': item.colors.backgroundColor }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.level1 }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.level2 }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.blue }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.yellow }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.green }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.red }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': item.colors.purple }"
          ></div>
        </div>
      </div>
    </template>
  </Select>
</template>

<style lang="scss" scoped>
.theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  border: solid 1px transparent;

  &.active {
    border: solid 1px var(--c-primary);
  }

  > .label {
    margin-left: 0.75rem;
    text-transform: capitalize;
  }

  > .colors {
    display: flex;
    margin-right: 0.75rem;

    > .color {
      height: 0.75rem;
      width: 0.75rem;
      border: solid 1.5px black;
      border-radius: 50%;
      display: inline-block;
      margin: 0 -0.125rem;

      &:first-child {
        margin: 0 -0.125rem 0 0;
      }
    }
  }
}

.direction-up {
  :deep(.items) {
    bottom: 120%; // Items will move upwards.
  }
}
</style>
