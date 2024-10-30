<script setup lang="ts">
import type { Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import Navigation from "@CM/Navigation/Navigation.vue";

import "@/Styles/Themes/CM/Chad.css";
import "@/Styles/Themes/CM/Dark.css";
import "@/Styles/Themes/CM/Light.css";

// Theme
const theme = computed<Theme>(() => ({
  colors: colors.value,
  colorsArray: [
    colors.value.blue,
    colors.value.yellow,
    colors.value.green,
    colors.value.red,
    colors.value.purple,
  ],
}));

provideTheme(theme);
</script>

<template>
  <Layout>
    <template #navigation>
      <Navigation class="navigation" />
    </template>
  </Layout>
</template>

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
