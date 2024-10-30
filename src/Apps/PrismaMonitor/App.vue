<script setup lang="ts">
import Navigation from "@PM/Navigation/Navigation.vue";
import { useSettingsStore } from "@PM/Stores";

import "@/Styles/Themes/PM/Dark.css";
import "@/Styles/Themes/PM/Light.css";

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
      <Navigation class="navigation" />
    </template>
  </Layout>
</template>

<style scoped>
.navigation {
  grid-area: navigation;
}
</style>
