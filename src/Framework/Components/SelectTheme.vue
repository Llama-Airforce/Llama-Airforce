<script setup lang="ts">
import chad from "@/Assets/Icons/chad.png";
import { useStorage } from "@vueuse/core";

const STORAGE_THEME = "theme";

const { themes = ["dark"], direction = "down" } = defineProps<{
  themes?: string[];
  direction?: "up" | "down";
}>();

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
    :direction
    :options="themes.map((x) => x)"
    :selected="theme"
    @select="theme = $event"
  >
    <template #option="{ option }">
      <div class="theme">
        <LucideMoon v-if="option === 'dark'" />
        <LucideSun v-else-if="option === 'light'" />
        <img
          v-else-if="option === 'chad'"
          :src="chad"
        />

        <div class="label">{{ option }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.theme {
  display: flex;
  gap: 1.5ch;
  align-items: center;
  text-transform: capitalize;

  border: solid 1px transparent;

  &.active {
    border: solid 1px var(--c-primary);
  }

  img {
    width: 16px;
  }
}
</style>
