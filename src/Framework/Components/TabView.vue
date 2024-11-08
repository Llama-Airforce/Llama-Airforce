<script setup lang="ts">
import type TabItem from "./TabItem.vue";

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
  if (!slots.default) {
    return [];
  }

  return slots
    .default()
    .filter((tab) => (tab as unknown as typeof TabItem).props)
    .map((x) => x as unknown as typeof TabItem);
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
    <div class="tab-controls">
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

      <div
        v-if="$slots['actions']"
        class="actions"
      >
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="tabs">
      <div
        v-for="(tab, i) in tabs"
        v-show="tabActive === i"
        :key="i"
        class="tab"
      >
        <component :is="tab" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-controls {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  > ul {
    display: flex;
    flex-wrap: wrap; /* Scrolling kinda sucks for discoverabiliy and UX. */

    padding: 0;
    margin: 0;
    list-style-type: none;
    align-self: flex-start;

    --border-thickness: 2px;

    > li {
      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;
      padding: 1rem;

      user-select: none;
      color: var(--c-lvl5);
      font-weight: 500;

      border-bottom: var(
        --border-bottom,
        var(--border-thickness) solid var(--c-lvl2)
      );
      transition: border, color 125ms ease;

      &:not(.active) {
        cursor: pointer;
      }

      &:hover:not(.disabled) {
        border-bottom: var(--border-thickness) solid
          hsl(from var(--c-lvl2) h s calc(l + 6 * var(--color-scheme-dark)));

        color: hsl(
          from var(--c-lvl5) h s calc(l + 6 * var(--color-scheme-dark))
        );
      }

      &:active:not(.disabled),
      &.active:not(.disabled) {
        border-bottom: var(--border-thickness) solid var(--c-primary);
        color: var(--c-text);
      }

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
</style>
