<template>
  <div class="wrappers">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <Overview v-if="tabActive === 0"></Overview>
      </TabItem>

      <TabItem header="cvxPRISMA">
        <CvxPrisma v-if="tabActive === 1"></CvxPrisma>
      </TabItem>

      <TabItem header="yPRISMA">
        <YPrisma v-if="tabActive === 2"></YPrisma>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import Overview from "@PM/Pages/Wrappers/Overview.vue";
import CvxPrisma from "@PM/Pages/Wrappers/CvxPrisma.vue";
import YPrisma from "@PM/Pages/Wrappers/YPrisma.vue";

// Refs
type Tabs = "overview" | "cvxprisma" | "yprisma";
const tab = useRouteParams<Tabs>("tab", "overview");

const router = useRouter();

const tabActive = ref(0);

// Hooks
onMounted(() => {
  if (tab.value === "overview") {
    tabActive.value = 0;
  } else if (tab.value === "cvxprisma") {
    tabActive.value = 1;
  } else if (tab.value === "yprisma") {
    tabActive.value = 2;
  }
});

watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({
      name: "wrappers",
      params: { tab: "" },
    });
  } else if (newTab === 1) {
    await router.push({
      name: "wrappers",
      params: { tab: "cvxprisma" },
    });
  } else if (newTab === 2) {
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
