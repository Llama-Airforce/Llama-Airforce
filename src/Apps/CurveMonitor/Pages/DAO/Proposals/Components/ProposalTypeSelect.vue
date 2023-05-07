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
    <template #item="props: { item: ProposalTypeAll }">
      <div class="item">
        <div class="label">{{ t(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Select } from "@/Framework";
import {
  ProposalType,
  proposalTypes,
} from "@CM/Pages/DAO/Proposals/Models/Proposal";

type ProposalTypeAll = "all" & ProposalType;

const { t } = useI18n();

const types = ["all", ...proposalTypes];

// Emits
const emit = defineEmits<{
  (e: "select", type: ProposalTypeAll): void;
}>();

// Refs
const selectTypeOpen = ref(false);
const type: Ref<ProposalTypeAll> = ref<ProposalTypeAll>(
  "all" as ProposalTypeAll
);

// Events
const onTypeOpen = (): void => {
  selectTypeOpen.value = !selectTypeOpen.value;
};

const onTypeSelect = (option: unknown): void => {
  type.value = option as ProposalTypeAll;
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
gauge: Gauge
parameter: Parameter
other: Other
</i18n>
