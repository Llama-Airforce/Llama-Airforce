<template>
  <Card
    :title="t('title')"
    :loading="loading"
    :content="content"
  >
    <div v-if="content">
      <div>
        <span class="text">Users in soft liquidation: </span>
        {{ content.softLiqUsers }} ({{
          (content.softLiqRatio * 100).toFixed(2)
        }}%)
      </div>

      <div>
        <span class="text">Median health:</span>
        {{ content.medianHealth.toFixed(6) }}
      </div>

      <div>
        <span class="text">Collaterization ratio:</span>
        {{ (content.collatRatio * 100).toFixed(2) }}%
      </div>

      <div>
        <span class="text">Liquidatable positions:</span>
        {{ content.liqablePositions }}
      </div>

      <div>
        <span class="text">Liquidatable positions' debt:</span> ${{
          formatter(content.liqableDebt)
        }}
      </div>

      <div>
        <span class="text">Liquidatable assets:</span> ${{
          formatter(content.liqableCollatUsd + content.liqableStable)
        }}
        (C: ${{ formatter(content.liqableCollatUsd) }}, S: ${{
          formatter(content.liqableStable)
        }})
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { getHost } from "@/Services/Host";
import CurveService from "@CM/Pages/Platform/CrvUsd/Services/CurveService";
import type { Market } from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Props
interface Props {
  market?: Market | null;
}

const { market = null } = defineProps<Props>();

// Refs
const content = computed(() => marketState.value);

// Data
const {
  loading,
  data: marketState,
  load,
} = usePromise(() => {
  if (market) {
    return curveService
      .getMarketStateHealth(market.address)
      .then((x) => x.health);
  } else {
    return Promise.resolve(null);
  }
}, null);

// Watches
watch(() => market, load);

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
