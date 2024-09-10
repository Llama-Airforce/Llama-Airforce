<script setup lang="ts">
import Transfers from "@CM/Pages/DefiMonitor/Tabs/Transfers.vue";
import Swaps from "@CM/Pages/DefiMonitor/Tabs/Swaps.vue";

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["transfers", "swaps"],
  "defimonitor"
);
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Transfers">
        <KeepAlive>
          <Transfers v-if="tabActive === 'transfers'"></Transfers>
        </KeepAlive>
      </TabItem>

      <TabItem header="Swaps">
        <KeepAlive>
          <Swaps v-if="tabActive === 'swaps'"></Swaps>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
