<script setup lang="ts">
import { useProposals } from "@HA/queries/dao";
import type { ProposalStatus } from "@HA/services/dao/schema";
import ProposalComponent from "./Components/Proposal.vue";

const tabActive = ref(0);

const { page, onPage } = usePaginationAsync();

const proposalSearch = ref("");
const proposalSearchDebounced = refDebounced(proposalSearch, 300);

const proposalStatus = computed((): ProposalStatus => {
  switch (tabActive.value) {
    case 0:
      return "all";
    case 1:
      return "active";
    case 2:
      return "executable";
    case 3:
      return "failed";
    case 4:
      return "executed";
    default:
      return "all";
  }
});

const search = computed(() =>
  proposalSearchDebounced.value.toLocaleLowerCase()
);

const { isFetching: loading, data } = useProposals(
  computed(() => ({
    search_string: search.value,
  }))
);

const count = computed(() => data.value?.length ?? 0);
const proposals = computed(() =>
  (data.value ?? [])
    .filter(
      (x) => proposalStatus.value === "all" || x.status === proposalStatus.value
    )
    .orderBy((x) => x.createdAt.getDate(), "desc")
);
</script>

<template>
  <div class="dashboard">
    <DashboardHeader
      title="Governance proposals"
      description="View and search for governance proposals"
    />

    <TabView @tab="tabActive = $event.index">
      <TabItem header="All" />
      <TabItem header="Active" />
      <TabItem header="Passed" />
      <TabItem header="Denied" />
      <TabItem header="Executed" />
    </TabView>

    <div class="filters">
      <InputText
        v-model="proposalSearch"
        search
        style="flex-grow: 1"
        placeholder="Search for Resupply proposals"
      />

      <Pagination
        class="pagination"
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />
    </div>

    <div class="proposals-content">
      <ProposalComponent
        v-for="proposal in proposals"
        :key="proposal.proposalId"
        class="loading-backdrop"
        :proposal
        :class="{ loading }"
      />

      <Pagination
        class="pagination"
        :items-count="count"
        :items-per-page="10"
        :page
        @page="onPage"
      />

      <div v-if="proposals.length === 0">No proposals could be found.</div>

      <Spinner :loading />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }

  > .filters {
    display: flex;
    gap: 1rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }
  }

  .pagination {
    justify-content: end;
  }

  .proposals-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);
  }

  .spinner {
    position: absolute;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
