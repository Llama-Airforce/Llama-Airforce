<script setup lang="ts">
import CrvUsd from "./Tabs/CrvUsd.vue";
import Swaps from "./Tabs/Swaps.vue";
import Transfers from "./Tabs/Transfers.vue";

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["transfers", "swaps", "crvusd"],
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
          <Transfers v-if="tabActive === 'transfers'" />
        </KeepAlive>
      </TabItem>

      <TabItem header="Swaps">
        <KeepAlive>
          <Swaps v-if="tabActive === 'swaps'" />
        </KeepAlive>
      </TabItem>

      <TabItem header="crvUSD">
        <KeepAlive>
          <CrvUsd v-if="tabActive === 'crvusd'" />
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
