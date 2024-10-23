<script setup lang="ts">
import { useStorage } from "@vueuse/core";

const STORAGE_THEME = "theme";

const { themes = ["dark"] } = defineProps<{ themes: string[] }>();

const browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultTheme = browserDark ? "dark" : "light";

const theme = useStorage<string>(
  STORAGE_THEME,
  themes.find((t) => t === defaultTheme) ?? themes[0]
);

watch(
  theme,
  (theme) => {
    window.document.documentElement.setAttribute("data-theme", theme);
  },
  { immediate: true }
);
</script>

<template>
  <Select
    direction="up"
    :options="themes.map((x) => x)"
    :selected="theme"
    @select="theme = $event"
  >
    <template #option="{ option }">
      <div class="theme">
        <div class="label">{{ option }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.theme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: capitalize;

  border: solid 1px transparent;

  &.active {
    border: solid 1px var(--c-primary);
  }
}
</style>
