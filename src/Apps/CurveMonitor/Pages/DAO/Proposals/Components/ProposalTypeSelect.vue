<script setup lang="ts">
import { type ProposalType, proposalTypes } from "@curvefi/prices-api/proposal";

const emit = defineEmits<{
  select: [type: ProposalType];
}>();

// Select
const types = [...proposalTypes];
const type = ref<ProposalType>("ownership");

const onTypeSelect = (option: ProposalType): void => {
  type.value = option;
  emit("select", type.value);
};
</script>

<template>
  <Select
    :options="types.map((x) => x)"
    :selected="type"
    @select="onTypeSelect"
  >
    <template #option="{ option }">
      <div class="option">
        <div class="label">{{ capitalize(option) }}</div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
  display: flex;
  align-items: center;

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}
</style>
