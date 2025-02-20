<script setup lang="ts">
import type { Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import Navigation from "@CM/shell/Navigation.vue";
import Header from "@CM/shell/Header.vue";

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
      <Navigation style="grid-area: navigation" />
    </template>

    <template #header>
      <Header style="grid-area: header" />
    </template>
  </Layout>
</template>
