<script setup lang="ts">
import { colors } from "@/Styles/ChartTheme";
import type { Theme } from "@/Styles/Theme";
import Header from "@HA/shell/Header.vue";
import Navigation from "@HA/shell/Navigation.vue";

import "@/Styles/Themes/HA/Dark.css";
import "@/Styles/Themes/HA/Light.css";

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
