<template>
  <div class="mev">
    <LabelsWorstRelative
      style="grid-row: 1; grid-column: 1"
    ></LabelsWorstRelative>

    <LabelsWorstAbsolute
      style="grid-row: 1; grid-column: 2"
    ></LabelsWorstAbsolute>

    <Sandwiches style="grid-row: 2; grid-column: 1 / -1"></Sandwiches>
  </div>
</template>

<script setup lang="ts">
import { createSocketMEV } from "@CM/Services/Sockets";
import { MEVService } from "@CM/Pages/Platform/MEV/Services";
import { useMEVStore } from "@CM/Pages/Platform/MEV/Store";
import LabelsWorstRelative from "@CM/Pages/Platform/MEV/Components/LabelsWorstRelative.vue";
import LabelsWorstAbsolute from "@CM/Pages/Platform/MEV/Components/LabelsWorstAbsolute.vue";
import Sandwiches from "@CM/Pages/Platform/MEV/Components/Sandwiches.vue";

const hostMEV = "wss://api.curvemonitor.com";
const socketMEV = createSocketMEV(hostMEV);

const mevService = new MEVService(socketMEV);

// Refs.
const store = useMEVStore();
store.socket = socketMEV;

// Hooks
onMounted(() => {
  socketMEV.connect();

  void mevService.getSandwichLabelOccurrences().then((x) => {
    store.labelRankingExtended = x;
    return;
  });

  void mevService.getSandwiches().then((x) => {
    store.sandwiches = x.sandwiches;
    store.sandwichesPage = { cur: 1, total: x.totalPages };
    return;
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("mev");

.mev {
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
}
</style>
