<script setup lang="ts">
import { type ProposalType, proposalTypes } from "@CM/Services/Proposal";
import { capitalize } from "@/Util";

const types = [...proposalTypes].filter((x) => x !== "other");

// Emits
const emit = defineEmits<{
  select: [type: ProposalType];
}>();

// Select
const type = ref<ProposalType>("all");

const onTypeSelect = (option: ProposalType): void => {
  type.value = option;
  emit("select", type.value);
};
</script>

<template>
  <Select
    :options="types.map((x) => x)"
    :selected="type"
    @input="onTypeSelect"
  >
    <template #item="props: { item: ProposalType }">
      <div class="item">
        <div class="label">{{ capitalize(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.item {
  display: flex;
  align-items: center;

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
