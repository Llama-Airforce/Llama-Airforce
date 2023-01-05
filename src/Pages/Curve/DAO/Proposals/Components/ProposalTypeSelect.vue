<template>
  <div
    class="selector"
    tabindex="0"
    @click.stop="onTypeOpen"
    @blur="selectTypeOpen = false"
  >
    <Select
      class="select"
      :options="types.map((x) => x)"
      :selected="type"
      :open="selectTypeOpen"
      @input="onTypeSelect"
    >
      <template #item="props: { item: ProposalTypeAll }">
        <div class="item">
          <div class="label">{{ t(props.item) }}</div>
        </div>
      </template>
    </Select>

    <div class="chevron">
      <i class="fas fa-chevron-up"></i>
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
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
.selector {
  position: relative;
  display: flex;

  > .chevron {
    position: absolute;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    top: 0.5rem;
    right: 1rem;
  }

  ::v-deep(.select) {
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
    transition: background $hover-duration;

    background: lighten($background-color-widget, 6%);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

    &:hover {
      background: lighten($background-color-widget, 12%);
    }

    > .selected {
      font-size: 1rem;
      padding: 0.4rem 0.75rem;
    }

    > .items {
      margin-top: 0.5rem;
      right: 10px;
      left: 0;
      line-height: 1.5rem;
      font-size: 1rem;
      width: 100%;

      > div {
        padding: 0.4rem 0.75rem;
      }
    }

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
}
</style>

<i18n lang="yaml" locale="en">
all: All
gauge: Gauge
parameter: Parameter
other: Other
</i18n>
