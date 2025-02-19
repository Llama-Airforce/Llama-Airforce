<script setup lang="ts">
import BlockOracles from "./Tabs/BlockOracles.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["block-oracles"],
  "cross-chain"
);
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Block Oracles">
        <KeepAlive>
          <BlockOracles v-if="tabActive === 'block-oracles'" />
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
