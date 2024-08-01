<template>
  <div class="monitor">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="MEV">
        <KeepAlive>
          <MEV v-if="tabActive === 'mev'"></MEV>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import MEV from "@CM/Pages/Platform/Monitor/Tabs/MEV.vue";

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(["mev"], "monitor");
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("monitor");

.monitor {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
