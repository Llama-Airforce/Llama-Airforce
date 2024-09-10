<script setup lang="ts">
import Navigation from "@CB/Navigation/Navigation.vue";

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

<style lang="scss">
@import "@/Styles/Themes/CB/Chad.scss";
@import "@/Styles/Themes/CB/Light.scss";
@import "@/Styles/Themes/CB/Dark.scss";

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

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
