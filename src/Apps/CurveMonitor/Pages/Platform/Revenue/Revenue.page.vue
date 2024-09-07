<script setup lang="ts">
import Overview from "@CM/Pages/Platform/Revenue/Tabs/Overview.vue";
import Distributions from "@CM/Pages/Platform/Revenue/Tabs/Distributions.vue";
import Cushions from "@CM/Pages/Platform/Revenue/Tabs/Cushions.vue";
import Settlements from "@CM/Pages/Platform/Revenue/Tabs/Settlements.vue";
import Harvesting from "@CM/Pages/Platform/Revenue/Tabs/Harvesting.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "distributions", "cushions", "settlements", "harvesting"],
  "revenue"
);
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Revenue">
        <KeepAlive>
          <Overview v-if="tabActive === 'overview'"></Overview>
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

      <TabItem header="Harvesting">
        <KeepAlive>
          <Harvesting v-if="tabActive === 'harvesting'"></Harvesting>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
