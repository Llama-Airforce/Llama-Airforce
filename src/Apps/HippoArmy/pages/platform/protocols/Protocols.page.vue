<script setup lang="ts">
import Protocol from "./tabs/Protocol.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["curvelend", "fraxlend"],
  "protocols",
  undefined,
  {
    tabParamName: "protocolName",
  }
);

const { crumbs } = storeToRefs(useBreadcrumbStore());
const route = useRoute();
watch(
  () => route.name,
  (newName) => {
    if (newName !== "pair") {
      crumbs.value = [
        {
          id: "protocols",
          label: "Protocols",
          pathName: "protocols",
        },
      ];
    }
  },
  { immediate: true }
);
</script>

<template>
  <router-view v-if="$route.name === 'pair'" />

  <div
    v-else
    class="dashboard"
  >
    <DashboardHeader
      style="grid-area: header"
      title="Protocols"
      description="Lending markets metrics for Curve Lend and Frax Lend protocols"
    />

    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Curve Lend">
        <KeepAlive>
          <Protocol
            v-if="tabActive === 'curvelend'"
            protocol="curvelend"
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Frax Lend">
        <KeepAlive>
          <Protocol
            v-if="tabActive === 'fraxlend'"
            protocol="fraxlend"
          />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-areas:
    "header"
    "content";
}
</style>
