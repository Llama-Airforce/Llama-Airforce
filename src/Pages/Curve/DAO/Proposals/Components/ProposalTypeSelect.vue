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
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Select } from "@/Framework";
import {
  ProposalType,
  proposalTypes,
} from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

type ProposalTypeAll = "all" & ProposalType;

const { t } = useI18n();

// Emits
const emit = defineEmits<{
  (e: "select", type: ProposalTypeAll): void;
}>();

// Refs
let selectTypeOpen = $ref(false);
const types = ["all", ...proposalTypes];
let type: ProposalTypeAll = $ref("all" as ProposalTypeAll);

// Events
const onTypeOpen = (): void => {
  selectTypeOpen = !selectTypeOpen;
};

const onTypeSelect = (option: unknown): void => {
  type = option as ProposalTypeAll;
  emit("select", type);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
::v-deep(.select) {
  .item {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

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
