<script setup lang="ts">
import ProposalComponent from "@PM/Pages/Proposals/Components/Proposal.vue";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

const { proposals } = defineProps<{
  proposals: Proposal[];
}>();

// Refs
const proposalSearch = ref("");
const placeholder = ref(t("search-placeholder"));

const rows = computed(() => {
  const search = proposalSearch.value.toLocaleLowerCase();

  return proposals.filter(
    (p) => !!p.metadata && p.metadata.title.toLocaleLowerCase().includes(search)
  );
});

const rowsPerPage = 10;
const { page, rowsPage, onPage } = usePagination(rows, rowsPerPage);
</script>

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

      <div style="display: flex; gap: 1rem; justify-content: end">
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

<style scoped>
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
      & {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .pagination {
    justify-content: end;
  }
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for Prisma proposals
no-proposals: No proposals could be found.
</i18n>
