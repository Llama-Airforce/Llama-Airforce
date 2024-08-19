<script setup lang="ts">
import Transfers from "@CM/Pages/DefiMonitor/Tabs/Transfers.vue";

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["transfers"],
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
