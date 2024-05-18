<template>
  <div class="revenue">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Revenue">
        <KeepAlive>
          <Dashboard v-if="tabActive === 'overview'"></Dashboard>
        </KeepAlive>
      </TabItem>

      <TabItem header="Cushions">
        <KeepAlive>
          <Cushions v-if="tabActive === 'cushions'"></Cushions>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "@CM/Pages/Platform/Revenue/Dashboard.vue";
import Cushions from "@CM/Pages/Platform/Revenue/Cushions.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "cushions"],
  "revenue"
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("revenue");

.revenue {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
