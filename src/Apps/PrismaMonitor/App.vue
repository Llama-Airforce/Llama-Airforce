<script setup lang="ts">
import Navigation from "@PM/Navigation/Navigation.vue";
import { useSettingsStore } from "@PM/Stores";

// Stores
const settingStore = useSettingsStore();
const storeBreadcrumb = useBreadcrumbStore();

// Refs
const route = useRoute();

// Hooks
onMounted(() => {
  if (settingStore.flavor === "lrt") {
    window.document.documentElement.setAttribute("data-flavor", "lrt");
  }
});

// Watches
watch(
  () => route.fullPath,
  (route) => {
    const noCrumbs = [
      "/pool",
      "/stable",
      "/redemptions",
      "/liquidation",
      "/profile",
      "/wrappers",
      "/proposals",
      "/veprisma",
    ];

    if (noCrumbs.some((x) => route.startsWith(x))) {
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

<style lang="scss">
@import "@/Styles/Themes/PM/Light.scss";
@import "@/Styles/Themes/PM/Dark.scss";

[data-theme="light"] {
  @include themeLight();
}

[data-theme="dark"] {
  @include themeDark();
}

[data-theme="light"][data-flavor="lrt"] {
  @include themeLightLrt();
}

[data-theme="dark"][data-flavor="lrt"] {
  @include themeDarkLrt();
}
</style>

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
