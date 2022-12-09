<template>
  <div class="proposals">
    <div class="dashboard">
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

      <Spinner
        v-else
        class="spinner"
      ></Spinner>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import TabView from "@/Framework/TabView.vue";
import TabItem from "@/Framework/TabItem.vue";
import Spinner from "@/Framework/Spinner.vue";
import ProposalsTab from "@/Pages/Curve/DAO/Proposals/ProposalsTab.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import ProposalService from "@/Pages/Curve/DAO/Proposals/Services/ProposalService";
import { getHost } from "@/Services/Host";
import { getStatus } from "@/Pages/Curve/DAO/Proposals/Util/ProposalHelper";
import { minDelay } from "@/Util/PromiseHelper";

const { t } = useI18n();

const proposalService = new ProposalService(getHost());

// Refs
let loading = $ref(false);
let proposals: Proposal[] = $ref([]);
const tabActive = $ref(0);

const proposalsActive = $computed((): Proposal[] => {
  return proposals.filter((p) => getStatus(p) === "active");
});

const proposalsPassed = $computed((): Proposal[] => {
  return proposals.filter((p) => getStatus(p) === "passed");
});

const proposalsDenied = $computed((): Proposal[] => {
  return proposals.filter((p) => getStatus(p) === "denied");
});

const proposalsExecuted = $computed((): Proposal[] => {
  return proposals.filter((p) => getStatus(p) === "executed");
});

// Hooks
onMounted(async () => {
  loading = true;

  try {
    proposals = await minDelay(
      proposalService
        .getProposals()
        .then((ps) => ps.sort((a, b) => b.start - a.start)),
      1000
    );
  } finally {
    loading = false;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.proposals {
  display: flex;
  justify-content: center;

  .dashboard {
    padding: $page-margin;
    width: 100%;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
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
