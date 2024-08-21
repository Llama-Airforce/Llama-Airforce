<script setup lang="ts">
import { type ActivityType, activityTypes } from "@CM/Services/Chains";

const types: (ActivityType | "all")[] = ["all", ...activityTypes];

// Emits
const emit = defineEmits<{
  select: [type: ActivityType | "all"];
}>();

// Refs
const selectTypeOpen = ref(false);
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

// Events
function onTypeOpen() {
  selectTypeOpen.value = !selectTypeOpen.value;
}

function onTypeSelect(option: ActivityType | "all") {
  type.value = option;
  emit("select", type.value);
}
</script>

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
    <template #item="props: { item: ActivityType }">
      <div class="item">
        <div class="label">{{ label(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
:deep(.select) {
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
