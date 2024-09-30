<script setup lang="ts">
import Navigation from "@PM/Navigation/Navigation.vue";
import { useSettingsStore } from "@PM/Stores";

import "@/Styles/Themes/PM/Dark.css";
import "@/Styles/Themes/PM/Light.css";

// Breadcrumb hiding
const storeBreadcrumb = useBreadcrumbStore();
const route = useRoute();

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

// Theme
const settingStore = useSettingsStore();

onMounted(() => {
  if (settingStore.flavor === "lrt") {
    window.document.documentElement.setAttribute("data-flavor", "lrt");
  }
});

provideTheme(toRef(() => settingStore.theme));
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
