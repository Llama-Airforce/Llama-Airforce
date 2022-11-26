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

    <ProposalComponent
      v-for="proposal in proposalsFiltered"
      :key="proposal.id"
      :proposal="proposal"
    ></ProposalComponent>
  </div>
</template>

<script setup lang="ts">
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import InputText from "@/Framework/InputText.vue";
import ProposalComponent from "@/Pages/Curve/DAO/Proposals/Components/Proposal.vue";
import ProposalTypeSelect from "@/Pages/Curve/DAO/Proposals/Components/ProposalTypeSelect.vue";
import type {
  Proposal,
  ProposalType,
} from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposals: Proposal[];
}

const { proposals } = defineProps<Props>();

// Refs
const proposalSearch = $ref("");
const placeholder = $ref(t("search-placeholder"));
let proposalType = $ref("all" as "all" & ProposalType);

const proposalsFiltered = $computed((): Proposal[] => {
  const proposalsByType =
    proposalType === "all"
      ? proposals
      : proposals.filter((p) => p.type === proposalType);

  const search = proposalSearch.toLocaleLowerCase();

  return proposalsByType.filter(
    (p) =>
      p.title.toLocaleLowerCase().includes(search) ||
      p.description.toLocaleLowerCase().includes(search)
  );
});

// Events
const onTypeSelect = (type: "all" & ProposalType): void => {
  proposalType = type as "all" & ProposalType;
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
}
</style>

<i18n lang="yaml" locale="en">
search-placeholder: Search for Curve proposals
</i18n>
