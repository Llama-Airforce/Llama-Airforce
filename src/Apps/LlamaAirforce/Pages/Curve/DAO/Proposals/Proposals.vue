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
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { TabView, TabItem, Spinner } from "@/Framework";
import { minDelay } from "@/Util";
import ProposalsTab from "@LAF/Pages/Curve/DAO/Proposals/ProposalsTab.vue";
import type { Proposal } from "@LAF/Pages/Curve/DAO/Proposals/Models/Proposal";
import ProposalService from "@LAF/Pages/Curve/DAO/Proposals/Services/ProposalService";
import { getHost } from "@/Services/Host";
import { getStatus } from "@LAF/Pages/Curve/DAO/Proposals/Util/ProposalHelper";

const { t } = useI18n();

const proposalService = new ProposalService(getHost());

// Refs
const loading = ref(false);
const proposals = ref<Proposal[]>([]);
const tabActive = ref(0);

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

// Hooks
onMounted(async () => {
  loading.value = true;

  try {
    proposals.value = await minDelay(
      proposalService
        .getProposals()
        .then((ps) => ps.sort((a, b) => b.start - a.start)),
      1000
    );
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("proposals");

.proposals {
  .dashboard {
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
