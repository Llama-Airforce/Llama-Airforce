<script setup lang="ts">
import Overview from "@PM/Pages/Wrappers/Tabs/Overview.vue";
import CvxPrisma from "@PM/Pages/Wrappers/Tabs/CvxPrisma.vue";
import YPrisma from "@PM/Pages/Wrappers/Tabs/YPrisma.vue";

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "cvxprisma", "yprisma"],
  "wrappers"
);
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <Overview v-if="tabActive === 'overview'"></Overview>
      </TabItem>

      <TabItem header="cvxPRISMA">
        <CvxPrisma v-if="tabActive === 'cvxprisma'"></CvxPrisma>
      </TabItem>

      <TabItem header="yPRISMA">
        <YPrisma v-if="tabActive === 'yprisma'"></YPrisma>
      </TabItem>
    </TabView>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
}
</style>
