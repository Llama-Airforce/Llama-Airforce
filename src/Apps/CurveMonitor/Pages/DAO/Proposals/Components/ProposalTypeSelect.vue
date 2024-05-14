<template>
  <Select
    class="select"
    :options="types.map((x) => x)"
    :selected="type"
    :open="selectTypeOpen"
    @open="onTypeOpen"
    @close="selectTypeOpen = false"
    @input="onTypeSelect"
  >
    <template #item="props: { item: ProposalType }">
      <div class="item">
        <div class="label">{{ t(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import {
  type ProposalType,
  proposalTypes,
} from "@CM/Pages/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

const types = [...proposalTypes].filter((x) => x !== "other");

// Emits
const emit = defineEmits<{
  select: [type: ProposalType];
}>();

// Refs
const selectTypeOpen = ref(false);
const type = ref<ProposalType>("all");

// Events
const onTypeOpen = (): void => {
  selectTypeOpen.value = !selectTypeOpen.value;
};

const onTypeSelect = (option: unknown): void => {
  type.value = option as ProposalType;
  emit("select", type.value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
::v-deep(.select) {
  .item {
    display: flex;
    align-items: center;

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
all: All
ownership: Ownership
parameter: Parameter
other: Other
</i18n>
