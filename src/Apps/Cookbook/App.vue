<script setup lang="ts">
import Navigation from "@CB/Navigation/Navigation.vue";

import "@/Styles/Themes/CB/Chad.css";
import "@/Styles/Themes/CB/Dark.css";
import "@/Styles/Themes/CB/Light.css";

// Refs
const storeBreadcrumb = useBreadcrumbStore();
const route = useRoute();

// Watches
watch(
  () => route.fullPath,
  () => {
    //if (!newRoute.includes("crvusd")) {
    storeBreadcrumb.show = false;
    //}
  }
);
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
