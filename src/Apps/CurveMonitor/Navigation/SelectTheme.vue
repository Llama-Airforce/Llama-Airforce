<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { type ThemeId } from "@CM/Models";
import { useSettingsStore } from "@CM/Stores";

const STORAGE_THEME = "theme";

type ThemeDescription = {
  id: ThemeId;
};

const themes: ThemeDescription[] = [
  { id: "chad" },
  { id: "dark" },
  { id: "light" },
];

// Refs
const storeSettings = useSettingsStore();

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
      </div>
    </template>
  </Select>
</template>

<style scoped>
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
}
</style>
