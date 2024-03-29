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

      <div style="display: flex; gap: 1rem">
        <ProposalTypeSelect
          style="flex-grow: 1"
          @select="onTypeSelect"
        ></ProposalTypeSelect>

        <Pagination
          v-if="rows.length > 0"
          class="pagination"
          :items-count="rows.length"
          :items-per-page="rowsPerPage"
          :page="page"
          @page="onPage"
        ></Pagination>
      </div>
    </div>

    <ProposalComponent
      v-for="proposal in rowsPage"
      :key="proposal.id"
      :proposal="proposal"
    ></ProposalComponent>

    <Pagination
      v-if="rows.length > 0"
      class="pagination"
      :items-count="rows.length"
      :items-per-page="rowsPerPage"
      :page="page"
      @page="onPage"
    ></Pagination>

    <div v-if="rows.length === 0">{{ t("no-proposals") }}</div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { InputText, Pagination, usePagination } from "@/Framework";
import ProposalComponent from "@CM/Pages/DAO/Proposals/Components/Proposal.vue";
import ProposalTypeSelect from "@CM/Pages/DAO/Proposals/Components/ProposalTypeSelect.vue";
import type {
  Proposal,
  ProposalType,
} from "@CM/Pages/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

type Row = Proposal;

// Props
interface Props {
  proposals: Proposal[];
}

const { proposals } = defineProps<Props>();

// Refs
const proposalSearch = ref("");
const placeholder = ref(t("search-placeholder"));
const proposalType: Ref<"all" & ProposalType> = ref<"all" & ProposalType>(
  "all" as "all" & ProposalType
);

const rows = computed((): Row[] => {
  const search = proposalSearch.value.toLocaleLowerCase();

  const proposalTypeFilter =
    proposalType.value === "all"
      ? () => true
      : (p: Proposal) => p.type === proposalType.value;

  return chain(proposals)
    .filter(proposalTypeFilter)
    .filter((p) => p.metadata.toLocaleLowerCase().includes(search))
    .value();
});

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);

// Events
const onTypeSelect = (type: ProposalType): void => {
  proposalType.value = type as "all" & ProposalType;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.proposals-tab {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: var(--dashboard-gap);
  max-width: 100%;

  padding-top: var(--dashboard-gap);

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
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for Curve proposals
no-proposals: No proposals could be found.
</i18n>
