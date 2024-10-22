<script setup lang="ts">
import MEV from "@CM/Pages/Platform/Monitor/Tabs/MEV.vue";

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(["mev"], "monitor");
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="MEV">
        <KeepAlive>
          <MEV v-if="tabActive === 'mev'" />
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
