<template>
  <div class="revenue">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Revenue">
        <Dashboard></Dashboard>
      </TabItem>

      <TabItem header="Cushions">
        <Cushions></Cushions>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TabView, TabItem } from "@/Framework";
import Dashboard from "@CM/Pages/Platform/Revenue/Dashboard.vue";
import Cushions from "@CM/Pages/Platform/Revenue/Cushions.vue";

// Refs
const route = useRoute();
const router = useRouter();

const tabActive = ref(0);

// Hooks
onMounted(() => {
  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "cushions") {
      tabActive.value = 1;
    }
  }
});

// Watches
watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({ name: "revenue", params: { tab: "" } });
  } else if (newTab === 1) {
    await router.push({ name: "revenue", params: { tab: "cushions" } });
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("revenue");

.revenue {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
