<script setup lang="ts">
import { usePairs } from "@HA/queries/protocols";
import { pairName } from "@HA/util";
import Collateral from "./tabs/Collateral.vue";
import Health from "./tabs/Health.vue";
import Liquidations from "./tabs/Liquidations.vue";
import Overview from "./tabs/Overview.vue";
import Redemptions from "./tabs/Redemptions.vue";

const protocolName = useRouteParams<string>("protocolName");
const pairId = useRouteParams("pairId", undefined, {
  transform: Number,
});

const { isFetching: loading, data: pairs } = usePairs(
  computed(() => ({
    chain: "ethereum",
    protocol_name: protocolName.value,
  })),
  computed(() => !!protocolName.value)
);

const pair = computed(() =>
  (pairs.value ?? []).find((x) => x.pairId === pairId.value)
);

const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  pair,
  (pair) => {
    crumbs.value = [
      {
        id: "protocols",
        label: "Protocols",
        pathName: "protocols",
        params: () => ({
          protocolName: protocolName.value,
        }),
      },
      {
        id: "protocol",
        label: protocolName.value,
        pathName: "protocols",
        params: () => ({
          protocolName: protocolName.value,
        }),
      },
      {
        id: "pair",
        label: `Pair: ${pair?.name ? pairName(pair.name) : "?"}`,
      },
    ];
  },
  { immediate: true }
);

const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "collateral", "redemptions", "liquidations", "health"],
  "pair",
  undefined,
  {
    tabParamName: "pairTab",
  }
);
</script>

<template>
  <div class="dashboard">
    <Spinner :loading />

    <TabView
      v-if="!loading && pair"
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <Overview
            v-if="tabActive === 'overview'"
            :pair
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Collateral">
        <KeepAlive>
          <Collateral
            v-if="tabActive === 'collateral'"
            :pair
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Redemptions">
        <KeepAlive>
          <Redemptions
            v-if="tabActive === 'redemptions'"
            :pair
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidation">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations'"
            :pair
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Health">
        <KeepAlive>
          <Health
            v-if="tabActive === 'health'"
            :pair
          />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
