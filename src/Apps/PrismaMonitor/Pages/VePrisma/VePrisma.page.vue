<script setup lang="ts">
import TableLockers from "@PM/Pages/VePrisma/Tables/TableLockers.vue";
import TableVotesIncentives from "@PM/Pages/VePrisma/Tables/TableVotesIncentives.vue";
import ChartTopLockers from "@PM/Pages/VePrisma/Charts/ChartTopLockers.vue";
import VePrismaService from "@PM/Pages/VePrisma/VePrismaService";

const vePrismaService = new VePrismaService();

const { isFetching: loading, data } = useQuery({
  queryKey: ["prisma-top-lockers"],
  queryFn: () => vePrismaService.getTopLockers(),
  initialData: {
    totalWeight: 0,
    accounts: [],
  },
  initialDataUpdatedAt: 0,
});

const lockers = computed(() => data.value.accounts);
const totalWeight = computed(() => data.value.totalWeight);
</script>

<template>
  <div class="dashboard">
    <TableLockers
      style="grid-row: 1; grid-column: 1"
      :loading
      :lockers
    ></TableLockers>

    <ChartTopLockers
      style="grid-row: 1; grid-column: 2"
      :loading
      :lockers
      :total-weight
    ></ChartTopLockers>

    <TableVotesIncentives
      style="grid-row: 2; grid-column: 1 / -1"
    ></TableVotesIncentives>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
}
</style>
