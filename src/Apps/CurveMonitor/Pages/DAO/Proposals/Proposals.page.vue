<script setup lang="ts">
import { useQueryProposals } from "@CM/queries/proposal";
import type {
  ProposalType,
  ProposalStatus,
} from "@curvefi/prices-api/proposal";
import ProposalComponent from "./Components/Proposal.vue";
import ProposalTypeSelect from "./Components/ProposalTypeSelect.vue";

const tabActive = ref(0);

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);

const proposalSearch = ref("");
const proposalSearchDebounced = refDebounced(proposalSearch, 300);

const proposalType = ref<ProposalType>("ownership");

const proposalStatus = computed((): ProposalStatus => {
  switch (tabActive.value) {
    case 0:
      return "all";
    case 1:
      return "active";
    case 2:
      return "passed";
    case 3:
      return "denied";
    case 4:
      return "executed";
    default:
      return "all";
  }
});

const search = computed(() =>
  proposalSearchDebounced.value.toLocaleLowerCase()
);

const count = computed(() => data.value?.count ?? 0);
const proposals = computed(() =>
  (data.value?.proposals ?? []).orderBy((x) => x.start, "desc")
);

// Data
const { isFetching: loading, data } = useQueryProposals(
  pageDebounced,
  proposalType,
  proposalStatus,
  search
);

// Events
const onTypeSelect = (type: ProposalType): void => {
  proposalType.value = type;
};
</script>

<template>
  <div class="dashboard">
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
        placeholder="Search for Curve proposals"
      />

      <div style="display: flex; gap: 1rem; flex-wrap: wrap">
        <ProposalTypeSelect
          style="flex-grow: 1"
          @select="onTypeSelect"
        />

        <Pagination
          class="pagination"
          :items-count="count"
          :items-per-page="10"
          :page
          @page="onPage"
        />
      </div>
    </div>

    <div class="proposals-content">
      <ProposalComponent
        v-for="proposal in proposals"
        :key="proposal.id"
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
    display: grid;
    grid-template-columns: 1fr 1fr;
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
