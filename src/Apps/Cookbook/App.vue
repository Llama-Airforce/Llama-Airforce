<script setup lang="ts">
import type { Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import Navigation from "@CB/Navigation/Navigation.vue";

import "@/Styles/Themes/CB/Chad.css";
import "@/Styles/Themes/CB/Dark.css";
import "@/Styles/Themes/CB/Light.css";

// Breadcrumb hiding
const storeBreadcrumb = useBreadcrumbStore();
const route = useRoute();

watch(
  () => route.fullPath,
  () => {
    //if (!newRoute.includes("crvusd")) {
    storeBreadcrumb.show = false;
    //}
  }
);

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
      <Navigation class="navigation"></Navigation>
    </template>
  </Layout>
</template>

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
