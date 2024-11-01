<script setup lang="ts">
import type { Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import Navigation from "@CB/Shell/Navigation.vue";
import Header from "@CB/Shell/Header.vue";

import "@/Styles/Themes/CB/Chad.css";
import "@/Styles/Themes/CB/Dark.css";
import "@/Styles/Themes/CB/Light.css";

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
      <Navigation style="grid-area: navigation" />
    </template>

    <template #header>
      <Header style="grid-area: header" />
    </template>
  </Layout>
</template>
