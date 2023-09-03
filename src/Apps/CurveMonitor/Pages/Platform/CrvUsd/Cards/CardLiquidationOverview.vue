<template>
  <Card
    :title="t('title')"
    :loading="loading"
    :content="content"
  >
    <div v-if="content">
      <div><span class="text">Users in soft liquidation: </span> {{ content.softLiqUsers }} ({{ (content.softLiqRatio * 100).toFixed(2) }}%)</div>
      <div><span class="text">Median health:</span> {{ content.medianHealth.toFixed(6) }} </div>
      <div><span class="text">Collaterization ratio:</span> {{ (content.collatRatio * 100).toFixed(2) }}%</div>
      <div><span class="text">Liquidable positions:</span> {{ content.liqablePositions }}</div>
      <div><span class="text">Liquidable positions' debt:</span> ${{ formatter(content.liqableDebt) }}</div>
      <div><span class="text">Liquidable assets:</span> ${{ formatter(content.liqableCollatUsd + content.liqableStable) }} (C: ${{ formatter(content.liqableCollatUsd) }}, S: ${{ formatter(content.liqableStable) }})</div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { Card } from "@/Framework";
import { getHost } from "@/Services/Host";
import CurveService, {
  type MarketHealthState,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import {computed} from "vue";
import {round, unit} from "@/Util";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();
const content = computed(() => marketState.value);


// Refs
const marketState = ref<MarketHealthState | null >(null);
const loading = ref(false);

// Hooks
onMounted(async() => {
  loading.value = true;
  marketState.value = await curveService
    .getMarketStateHealth(market.address)
    .then((x) => x.health);
  loading.value = false;
});

// Watches
watch(
  () => market,
  async (newMarket) => {
    loading.value = true;

    if (!newMarket) {
      return;
    }

    marketState.value = await curveService
      .getMarketStateHealth(market.address)
      .then((x) => x.health);

  },
  { immediate: true }
);

const formatter = (y: number): string =>
  `${round(y, 1, "dollar")}${unit(y, "dollar")}`;

</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";


.text {
  font-size: 1.05rem;
  font-weight: bold;
  color: var(--c-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<i18n lang="yaml" locale="en">
title: General Health Metrics
</i18n>
