<script setup lang="ts">
import { type ProposalType, type ProposalStatus } from "@CM/Services/Proposal";
import { useQueryProposals } from "@CM/Services/Proposal/Queries";
import ProposalComponent from "@CM/Pages/DAO/Proposals/Components/Proposal.vue";
import ProposalTypeSelect from "@CM/Pages/DAO/Proposals/Components/ProposalTypeSelect.vue";

// Refs
const tabActive = ref(0);

const { page, onPage } = usePaginationAsync();
const pageDebounced = refDebounced(page, 200);

const proposalSearch = ref("");
const proposalSearchDebounced = refDebounced(proposalSearch, 300);

const proposalType = ref<ProposalType>("all");

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
  <div class="proposals">
    <TabView @tab="tabActive = $event.index">
      <TabItem header="All"></TabItem>
      <TabItem header="Active"></TabItem>
      <TabItem header="Passed"></TabItem>
      <TabItem header="Denied"></TabItem>
      <TabItem header="Executed"></TabItem>
    </TabView>

    <div class="filters">
      <InputText
        v-model="proposalSearch"
        class="search"
        placeholder="Search for Curve proposals"
        :search="true"
      >
      </InputText>

      <div style="display: flex; gap: 1rem">
        <ProposalTypeSelect
          style="flex-grow: 1"
          @select="onTypeSelect"
        ></ProposalTypeSelect>

        <Pagination
          class="pagination"
          :items-count="count"
          :items-per-page="10"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </div>

    <div class="proposals-content">
      <ProposalComponent
        v-for="proposal in proposals"
        :key="proposal.id"
        :proposal="proposal"
        :class="{ loading }"
      ></ProposalComponent>

      <Pagination
        class="pagination"
        :items-count="count"
        :items-per-page="10"
        :page="page"
        @page="onPage"
      ></Pagination>

      <div v-if="proposals.length === 0">No proposals could be found.</div>

      <Spinner
        class="spinner"
        :class="{ loading }"
      ></Spinner>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

// For some reason this fucks up the width.
@include dashboard("proposals");

.proposals {
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

    > .proposal {
      &.loading {
        @include loading-backdrop();
      }
    }
  }

  .spinner {
    position: absolute;
    top: 3.5rem;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    @include loading-spinner();
  }
}
</style>
