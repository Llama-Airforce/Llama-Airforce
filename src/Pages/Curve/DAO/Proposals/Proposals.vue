<template>
  <div class="proposals">
    <div class="dashboard">
      <TabView>
        <TabItem :header="t('all')">
          <ProposalsTab :proposals="proposals"></ProposalsTab>
        </TabItem>

        <TabItem :header="t('active')">
          <ProposalsTab :proposals="proposalsActive"></ProposalsTab>
        </TabItem>

        <TabItem :header="t('closed')">
          <ProposalsTab :proposals="proposalsClosed"></ProposalsTab>
        </TabItem>
      </TabView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import TabView from "@/Framework/TabView.vue";
import TabItem from "@/Framework/TabItem.vue";
import ProposalsTab from "@/Pages/Curve/DAO/Proposals/ProposalsTab.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Refs
const proposals: Proposal[] = [
  {
    id: "yolo",
    title: "Ownership proposal #123",
    description:
      "Add gauge 0xAbCd of gauge_type: 0 with weight: 0 Extended prop description (from IPFS)",
    type: "gauge",
    status: "active",
    start: 1670101193,
    end: 1671494020,
  },
  {
    id: "yolo2",
    title: "Parameter proposal #123",
    description:
      "Apply change fee_gamma from 0.005 to 0.008 for cbETH/ETH v2 pool Extended prop description (from IPFS)",
    type: "parameter",
    status: "closed",
    start: 1670101193,
    end: 1670101194,
  },
  {
    id: "yolo3",
    title: "Ownership proposal #124",
    description:
      "Add gauge 0xAbCd of gauge_type: 0 with weight: 0 Extended prop description (from IPFS)",
    type: "gauge",
    status: "active",
    start: 1670101193,
    end: 1670101194,
  },
  {
    id: "yolo4",
    title: "Parameter proposal #125",
    description:
      "Apply change fee_gamma from 0.005 to 0.008 for cbETH/ETH v2 pool Extended prop description (from IPFS)",
    type: "parameter",
    status: "closed",
    start: 1670101193,
    end: 1670101194,
  },
];

const proposalsActive = $computed((): Proposal[] => {
  return proposals.filter((p) => p.status === "active");
});

const proposalsClosed = $computed((): Proposal[] => {
  return proposals.filter((p) => p.status === "closed");
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
  }
}
</style>

<i18n lang="yaml" locale="en">
all: All
active: Active
closed: Closed
</i18n>
