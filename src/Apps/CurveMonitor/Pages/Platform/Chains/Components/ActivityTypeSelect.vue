<script setup lang="ts">
import { type ActivityType, activityTypes } from "@CM/Services/chains";

const emit = defineEmits<{
  select: [type: ActivityType | "all"];
}>();

// Select
const types: (ActivityType | "all")[] = ["all", ...activityTypes];
const type = ref<ActivityType | "all">("all");

function label(option: ActivityType | "all") {
  switch (option) {
    case "all":
      return "All Types";
    case "crvusd":
      return "crvUSD";
    case "lending":
      return "Lending";
    case "pools":
      return "Pools";
    case "router":
      return "Router";
    case "dao":
      return "DAO";
  }
}

function onTypeSelect(option: ActivityType | "all") {
  type.value = option;
  emit("select", type.value);
}
</script>

<template>
  <Select
    :options="types"
    :selected="type"
    @select="onTypeSelect"
  >
    <template #option="{ option }">
      <div class="option">
        <div class="label">{{ label(option) }}</div>
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
