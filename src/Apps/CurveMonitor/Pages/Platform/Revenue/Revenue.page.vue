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

      <TabItem header="Distributions">
        <KeepAlive>
          <Distributions v-if="tabActive === 'distributions'"></Distributions>
        </KeepAlive>
      </TabItem>

      <TabItem header="Cushions">
        <KeepAlive>
          <Cushions v-if="tabActive === 'cushions'"></Cushions>
        </KeepAlive>
      </TabItem>

      <TabItem header="Settlements">
        <KeepAlive>
          <Settlements v-if="tabActive === 'settlements'"></Settlements>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import Dashboard from "@CM/Pages/Platform/Revenue/Tabs/Dashboard.vue";
import Distributions from "@CM/Pages/Platform/Revenue/Tabs/Distributions.vue";
import Cushions from "@CM/Pages/Platform/Revenue/Tabs/Cushions.vue";
import Settlements from "@CM/Pages/Platform/Revenue/Tabs/Settlements.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "distributions", "cushions", "settlements"],
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
