<script setup lang="ts">
import Navigation from "@PM/Navigation/Navigation.vue";
import { useSettingsStore } from "@PM/Stores";

import "@/Styles/Themes/PM/Dark.css";
import "@/Styles/Themes/PM/Light.css";

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

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
