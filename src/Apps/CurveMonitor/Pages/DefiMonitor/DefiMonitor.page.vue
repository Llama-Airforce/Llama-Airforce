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
  <div class="monitor">
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("monitor");

.monitor {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
