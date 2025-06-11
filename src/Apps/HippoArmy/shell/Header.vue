<script setup lang="ts">
import Header from "@/Framework/Monitor/Shell/Header.vue";

const { onCrumb } = useBreadcrumbStore();
const { crumbs, show } = storeToRefs(useBreadcrumbStore());
</script>

<template>
  <Header>
    <Breadcrumb
      class="breadcrumb"
      :style="{ visibility: show ? 'visible' : 'hidden' }"
      :crumbs
      @crumb="onCrumb"
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
  grid-template-columns: 1fr 8rem auto;
  grid-template-rows: 2.5rem;
  grid-template-areas: "breadcrumb themes wallet";
}
</style>
