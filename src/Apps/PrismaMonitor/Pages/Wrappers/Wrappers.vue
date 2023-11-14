<template>
  <div class="wrappers">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="cvxPRISMA">
        <CvxPrisma v-if="tabActive === 0"></CvxPrisma>
      </TabItem>

      <TabItem header="yPRISMA">
        <YPrisma v-if="tabActive === 1"></YPrisma>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TabView, TabItem } from "@/Framework";
import CvxPrisma from "@PM/Pages/Wrappers/CvxPrisma.vue";
import YPrisma from "@PM/Pages/Wrappers/YPrisma.vue";

// Refs
const route = useRoute();
const router = useRouter();

const tabActive = ref(0);

// Hooks
onMounted(() => {
  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "cvxprisma") {
      tabActive.value = 0;
    } else if (tabParam === "yprisma") {
      tabActive.value = 1;
    }
  }
});

watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({
      name: "wrappers",
      params: { tab: "cvxprisma" },
    });
  } else if (newTab === 1) {
    await router.push({
      name: "wrappers",
      params: { tab: "yprisma" },
    });
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("wrappers");

.wrappers {
  max-width: calc(1920px - 18.125rem);
}
</style>
