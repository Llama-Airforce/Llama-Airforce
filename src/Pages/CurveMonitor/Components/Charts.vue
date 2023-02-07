<template>
  <Card
    class="charts"
    :title="t('title')"
  >
    <template #actions>
      <TabView
        class="types"
        @tab="tabIndex = $event.index"
      >
        <TabItem :header="t('price')"> </TabItem>
        <TabItem :header="t('tvl')"> </TabItem>
        <TabItem :header="t('volume')"> </TabItem>
      </TabView>
    </template>

    <Prices
      v-if="tabIndex === 0"
      class="prices"
    ></Prices>

    <TVL
      v-if="tabIndex === 1"
      class="tvl"
    ></TVL>

    <Volume
      v-if="tabIndex === 2"
      class="volumes"
    ></Volume>
  </Card>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Card, TabView, TabItem } from "@/Framework";
import TVL from "@/Pages/CurveMonitor/Components/TVL.vue";
import Prices from "@/Pages/CurveMonitor/Components/Prices.vue";
import Volume from "@/Pages/CurveMonitor/Components/Volume.vue";

const { t } = useI18n();

// Refs
const tabIndex = $ref(0);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.charts {
  ::v-deep(.card-header) {
    margin-top: 0.5rem !important;
  }

  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  ::v-deep(.types) {
    margin: 0 1rem;
    font-size: 0.85rem;

    ul {
      width: auto;
      border-bottom: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Charts
price: Price
tvl: TVL
volume: Volume
</i18n>
