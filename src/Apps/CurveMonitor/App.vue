<script setup lang="ts">
import Navigation from "@CM/Navigation/Navigation.vue";

import "@/Styles/Themes/CM/Chad.css";
import "@/Styles/Themes/CM/Dark.css";
import "@/Styles/Themes/CM/Light.css";

// Refs
const storeBreadcrumb = useBreadcrumbStore();
const route = useRoute();

// Watches
watch(
  () => route.fullPath,
  (newRoute) => {
    const crumbs = ["/platform/crvusd", "/platform/lending", "/platform/pools"];

    if (!crumbs.some((x) => newRoute.startsWith(x))) {
      storeBreadcrumb.show = false;
    }
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
