<script setup lang="ts">
import ProposalsTab from "@PM/Pages/Proposals/Components/ProposalsTab.vue";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import ProposalService from "@PM/Pages/Proposals/Services/ProposalService";
import { getStatus } from "@PM/Pages/Proposals/Util/ProposalHelper";

const { t } = useI18n();

const proposalService = new ProposalService();

// Refs
const tabActive = ref(0);

// Data
const { isFetching: loading, data: proposals } = useQuery({
  queryKey: ["prisma-proposals"],
  queryFn: () =>
    proposalService
      .getProposals()
      .then((ps) => ps.sort((a, b) => b.start - a.start)),
  initialData: [],
  initialDataUpdatedAt: 0,
});

const proposalsActive = computed((): Proposal[] => {
  return proposals.value.filter((p) => getStatus(p) === "active");
});

const proposalsPassed = computed((): Proposal[] => {
  return proposals.value.filter((p) => getStatus(p) === "passed");
});

const proposalsDenied = computed((): Proposal[] => {
  return proposals.value.filter((p) => getStatus(p) === "denied");
});

const proposalsExecuted = computed((): Proposal[] => {
  return proposals.value.filter((p) => getStatus(p) === "executed");
});
</script>

<template>
  <div class="proposals">
    <TabView
      v-if="!loading"
      @tab="tabActive = $event.index"
    >
      <TabItem :header="t('all')">
        <ProposalsTab
          v-if="tabActive === 0"
          :proposals="proposals"
        ></ProposalsTab>
      </TabItem>

      <TabItem :header="t('active')">
        <ProposalsTab
          v-if="tabActive === 1"
          :proposals="proposalsActive"
        ></ProposalsTab>
      </TabItem>

      <TabItem :header="t('passed')">
        <ProposalsTab
          v-if="tabActive === 2"
          :proposals="proposalsPassed"
        ></ProposalsTab>
      </TabItem>

      <TabItem :header="t('denied')">
        <ProposalsTab
          v-if="tabActive === 3"
          :proposals="proposalsDenied"
        ></ProposalsTab>
      </TabItem>

      <TabItem :header="t('executed')">
        <ProposalsTab
          v-if="tabActive === 4"
          :proposals="proposalsExecuted"
        ></ProposalsTab>
      </TabItem>
    </TabView>

    <Spinner :class="{ loading }"></Spinner>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.proposals {
  position: relative;
  max-width: calc(1920px - 18.125rem);
  margin: auto;
  padding: var(--page-margin);

  @media only screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>

<i18n lang="yaml" locale="en">
all: All
active: Active
passed: Passed
denied: Denied
executed: Executed
</i18n>
