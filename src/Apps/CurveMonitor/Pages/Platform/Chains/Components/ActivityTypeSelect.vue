<script setup lang="ts">
import { type ActivityType, activityTypes } from "@CM/Services/Chains";

const { t } = useI18n();

const types: (ActivityType | "all")[] = ["all", ...activityTypes];

// Emits
const emit = defineEmits<{
  select: [type: ActivityType | "all"];
}>();

// Refs
const selectTypeOpen = ref(false);
const type = ref<ActivityType | "all">("all");

// Events
const onTypeOpen = (): void => {
  selectTypeOpen.value = !selectTypeOpen.value;
};

const onTypeSelect = (option: ActivityType | "all"): void => {
  type.value = option;
  emit("select", type.value);
};
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
        <div class="label">{{ t(props.item) }}</div>
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

<i18n lang="yaml" locale="en">
all: All Types
crvusd: crvUSD
lending: Lending
pools: Pools
router: Router
dao: DAO
</i18n>
