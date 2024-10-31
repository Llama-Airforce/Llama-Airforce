<script setup lang="ts">
import Header from "@/Framework/Monitor/Header.vue";
import Wallet from "@/Wallet/Wallet.vue";

const { onCrumb } = useBreadcrumbStore();
const { crumbs } = storeToRefs(useBreadcrumbStore());
crumbs.value = [
  {
    id: "root",
    label: "Cookbook",
  },
];
</script>

<template>
  <Header>
    <Breadcrumb
      class="breadcrumb"
      :crumbs
      @crumb="onCrumb"
    />

    <SelectLanguage
      class="langs"
      :locales="['en']"
    />

    <SelectTheme
      class="themes"
      :themes="['dark', 'light', 'chad']"
    />

    <Wallet class="lvl2" />
  </Header>
</template>

<style scoped>
header {
  grid-template-columns: 1fr 8rem 8rem auto;
  grid-template-rows: 2.5rem;
  grid-template-areas: "breadcrumb langs themes wallet";
}
</style>
