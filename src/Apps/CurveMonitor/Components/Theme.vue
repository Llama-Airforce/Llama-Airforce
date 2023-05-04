<template>
  <a
    class="theme"
    @click="toggleTheme"
  >
    <div :class="{ sun: theme === 'light' }">
      <i :class="themeIcon"></i>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { Theme } from "@CM/Models/Theme";
import { useCurveMonitorStore } from "@CM/Store";

// Refs
const store = useCurveMonitorStore();

const theme = ref<Theme>("light");

const themeIcon = computed((): string => {
  switch (theme.value) {
    case "light":
      return "fas fa-sun";
    case "dark":
      return "fas fa-moon";
    default:
      return "fas fa-sun";
  }
});

// Hooks
onMounted(() => {
  /*
   * Set theme to dark mode if browser is in dark mode.
   * Except if localstorage says otherwise, though.
   */
  const browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const savedTheme = localStorage.getItem("theme");
  const prefersLight = savedTheme && savedTheme !== "dark";
  const prefersDark = savedTheme && savedTheme === "dark";

  if ((browserDark && !prefersLight) || prefersDark) {
    theme.value = "dark";
  }
});

// Watches
watch(
  theme,
  (newTheme) => {
    window.document.documentElement.setAttribute("data-theme", newTheme);
    store.theme = newTheme;
  },
  { immediate: true }
);

// Methods
const toggleTheme = (): void => {
  theme.value = theme.value === "light" ? "dark" : "light";
  localStorage.setItem("theme", theme.value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.theme {
  display: flex;
  justify-content: center;
  width: 2rem;

  color: var(--c-yellow);

  .sun {
    color: var(--c-red);
  }
}
</style>
