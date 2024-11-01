<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import Navigation from "@PM/Shell/Navigation.vue";
import Header from "@PM/Shell/Header.vue";

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
      <Navigation style="grid-area: navigation" />
    </template>

    <template #header>
      <Header style="grid-area: header" />
    </template>
  </Layout>
</template>
