<template>
  <div class="proposals-tab">
    <div class="filters">
      <InputText
        v-model="proposalSearch"
        class="search"
        :placeholder="placeholder"
        :search="true"
      >
      </InputText>

      <ProposalTypeSelect @select="onTypeSelect"></ProposalTypeSelect>
    </div>

    <Pagination
      class="pagination"
      :items-count="proposalsFiltered.length"
      :items-per-page="proposalsPerPage"
      :page="page"
      @page="onPage"
    ></Pagination>

    <ProposalComponent
      v-for="proposal in proposalsPage"
      :key="proposal.id"
      :proposal="proposal"
    ></ProposalComponent>

    <Pagination
      class="pagination"
      :items-count="proposalsFiltered.length"
      :items-per-page="proposalsPerPage"
      :page="page"
      @page="onPage"
    ></Pagination>
  </div>
</template>

<script setup lang="ts">
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import InputText from "@/Framework/InputText.vue";
import Pagination from "@/Framework/Pagination.vue";
import ProposalComponent from "@/Pages/Curve/DAO/Proposals/Components/Proposal.vue";
import ProposalTypeSelect from "@/Pages/Curve/DAO/Proposals/Components/ProposalTypeSelect.vue";
import type {
  Proposal,
  ProposalType,
} from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { chain } from "lodash";

const { t } = useI18n();

// Props
interface Props {
  proposals: Proposal[];
}

const { proposals } = defineProps<Props>();

// Refs
const proposalsPerPage = 10;
let page = $ref(1);

const proposalSearch = $ref("");
const placeholder = $ref(t("search-placeholder"));
let proposalType = $ref("all" as "all" & ProposalType);

const proposalsFiltered = $computed((): Proposal[] => {
  const search = proposalSearch.toLocaleLowerCase();

  const proposalTypeFilter =
    proposalType === "all"
      ? () => true
      : (p: Proposal) => p.type === proposalType;

  return chain(proposals)
    .filter(proposalTypeFilter)
    .filter((p) => p.metadata.toLocaleLowerCase().includes(search))
    .value();
});

const proposalsPage = $computed((): Proposal[] => {
  return chain(proposalsFiltered)
    .drop((page - 1) * proposalsPerPage)
    .take(proposalsPerPage)
    .value();
});

// Events
const onTypeSelect = (type: "all" & ProposalType): void => {
  proposalType = type as "all" & ProposalType;
};

const onPage = (pageNew: number): void => {
  page = pageNew;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.proposals-tab {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1.5rem;

  padding-top: 1.5rem;

  > .filters {
    display: grid;

    grid-template-columns: 0.75fr 0.25fr;
    gap: 1rem;
  }

  > .pagination {
    justify-content: end;
  }
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for Curve proposals
</i18n>
