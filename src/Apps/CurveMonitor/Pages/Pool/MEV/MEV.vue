<template>
  <div class="mev">
    <LabelsBest style="grid-row: 1; grid-column: 1"></LabelsBest>
    <LabelsWorst style="grid-row: 1; grid-column: 2"></LabelsWorst>

    <Sandwiches style="grid-row: 2; grid-column: 1 / -1"></Sandwiches>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { createSocketMEV } from "@CM/Services/Sockets";
import { MEVService } from "@CM/Pages/Pool/MEV/Services";
import { useMEVStore } from "@CM/Pages/Pool/MEV/Store";
import LabelsBest from "@CM/Pages/Pool/MEV/Components/LabelsBest.vue";
import LabelsWorst from "@CM/Pages/Pool/MEV/Components/LabelsWorst.vue";
import Sandwiches from "@CM/Pages/Pool/MEV/Components/Sandwiches.vue";

const hostMEV = "wss://api.curvemonitor.com";
const socketMEV = createSocketMEV(hostMEV);

const mevService = new MEVService(socketMEV);

// Refs.
const store = useMEVStore();
store.socket = socketMEV;

// Hooks
onMounted(() => {
  // MEV
  socketMEV.connect();
  void mevService.getSandwichLabelOccurrences().then((x) => {
    store.labelRankingExtended = x;
    return;
  });
  void mevService.getSandwiches().then((x) => {
    store.sandwiches = x;
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
