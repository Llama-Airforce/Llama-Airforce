<script setup lang="ts">
import { useParams } from "./composables/useParams";
import TablePairs from "./tables/TablePairs.vue";
import Analytics from "./tabs/Analytics.vue";
import Holdings from "./tabs/Holdings.vue";
import Overview from "./tabs/Overview.vue";

// Tabs
const isMounted = useMounted();
const { query } = useRoute();
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "holdings", "analytics"],
  "profile",
  undefined,
  {
    beforeNavigate: () => {
      if (isMounted.value) {
        delete query.pair_id;
      }
    },
  }
);

const { pairId } = useParams();
</script>

<template>
  <div class="dashboard">
    <TablePairs />

    <TabView
      v-if="typeof pairId === 'number' && !isNaN(pairId)"
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <Overview v-if="tabActive === 'overview'" />
      </TabItem>

      <TabItem header="Holdings">
        <Holdings v-if="tabActive === 'holdings'" />
      </TabItem>

      <TabItem header="Analytics">
        <KeepAlive>
          <Analytics v-if="tabActive === 'analytics'" />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;
}
</style>
