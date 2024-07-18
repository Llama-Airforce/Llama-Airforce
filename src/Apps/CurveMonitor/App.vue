<template>
  <Layout>
    <template #navigation>
      <Navigation class="navigation"></Navigation>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Navigation from "@CM/Navigation/Navigation.vue";

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

<style lang="scss">
@import "@/Styles/Themes/CM/Chad.scss";
@import "@/Styles/Themes/CM/Light.scss";
@import "@/Styles/Themes/CM/Dark.scss";

[data-theme="chad"] {
  @include themeChad();
}

[data-theme="light"] {
  @include themeLight();
}

[data-theme="dark"] {
  @include themeDark();
}
</style>

<style lang="scss" scoped>
.navigation {
  grid-area: navigation;
}
</style>
