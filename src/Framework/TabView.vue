<script setup lang="ts">
import type TabItem from "@/Framework/TabItem.vue";

const { active = 0 } = defineProps<{
  active?: number;
}>();

const emit = defineEmits<{
  tab: [params: { tab: typeof TabItem; index: number }];
}>();

// Refs
const tabActive = ref<number | null>(null);

const slots = useSlots();
const tabs = computed(() => {
  const tabs = slots.default
    ? (slots.default() as unknown as (typeof TabItem)[])
    : [];

  return tabs.filter((tab) => (tab as unknown as typeof TabItem).props);
});

// Watches
watch(
  () => active,
  (active): void => {
    tabActive.value = active;
    emit("tab", { tab: tabs.value[active], index: tabActive.value });
  },
  { immediate: true }
);

// Events
const onTabClick = (_tab: typeof TabItem, index: number): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  if ((_tab as any).props.disabled) {
    return;
  }

  tabActive.value = index;
  emit("tab", { tab: tabs.value[index], index: tabActive.value });
};
</script>

<template>
  <div class="tab-view">
    <!-- Headers -->
    <ul class="tab-headers">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-header"
        :class="{ active: tabActive === i, disabled: (tab as any).props.disabled }"
        @click="onTabClick(tab, i)"
      >
        {{ (tab as any).props.header }}
      </li>
    </ul>

    <!-- Content -->
    <div class="tabs">
      <div
        v-for="(tab, i) in tabs"
        v-show="tabActive === i"
        :key="i"
        class="tab"
      >
        <component :is="tab"></component>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-view {
  > ul {
    display: flex;
    flex-wrap: wrap; // Scrolling kinda sucks for discoverabiliy and UX.

    padding: 0;
    margin: 0;
    list-style-type: none;
    align-self: flex-start;
    border-bottom: 2px solid var(--c-lvl2);

    > li {
      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;
      padding: 1rem;

      user-select: none;
      color: var(--tab-text-color);
      font-weight: 500;

      transition: border, color 125ms ease;

      &:not(.active) {
        cursor: pointer;
      }

      &:hover:not(.disabled) {
        border-bottom: 2px solid var(--c-primary-active);
        margin: 0 0 -2px 0;
        color: var(--tab-text-color-hover);
      }

      &:active:not(.disabled),
      &.active:not(.disabled) {
        border-bottom: 2px solid var(--c-primary);
        margin: 0 0 -2px 0;
        color: var(--tab-text-color-active);
      }

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
