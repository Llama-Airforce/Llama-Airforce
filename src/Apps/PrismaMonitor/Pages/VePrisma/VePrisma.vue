<template>
  <div class="veprisma">
    <TableLockers
      style="grid-row: 1; grid-column: 1"
      :loading="loading"
      :lockers="lockers"
    ></TableLockers>

    <ChartTopLockers
      style="grid-row: 1; grid-column: 2"
      :loading="loading"
      :lockers="lockers"
      :total-weight="totalWeight"
    ></ChartTopLockers>

    <TableVotesIncentives
      style="grid-row: 2; grid-column: 1 / -1"
    ></TableVotesIncentives>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData } from "@/Framework";
import { getHost } from "@/Services/Host";
import TableLockers from "@PM/Pages/VePrisma/Tables/TableLockers.vue";
import TableVotesIncentives from "@PM/Pages/VePrisma/Tables/TableVotesIncentives.vue";
import ChartTopLockers from "@PM/Pages/VePrisma/Charts/ChartTopLockers.vue";
import VePrismaService from "@PM/Pages/VePrisma/VePrismaService";

const vePrismaService = new VePrismaService(getHost());

const { loading, data } = useData(() => vePrismaService.getTopLockers(), {
  totalWeight: 0,
  accounts: [],
});

const lockers = computed(() => data.value.accounts);
const totalWeight = computed(() => data.value.totalWeight);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("veprisma");

.veprisma {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
}
</style>
