<template>
  <div class="tab-view">
    <!-- Headers -->
    <ul class="tab-headers">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        class="tab-header"
        :class="{ active: tabActive === i }"
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

<script setup lang="ts">
import { ref, computed, watch, useSlots } from "vue";
import { TabItem } from "@/Framework";

// Props
interface Props {
  active?: number;
}

const { active = 0 } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "tab", params: { tab: typeof TabItem; index: number }): void;
}>();

// Refs
const tabActive = ref<number | null>(null);

const slots = useSlots();
const tabs = computed(() => {
  const tabs =
    slots && slots.default
      ? (slots.default() as unknown as typeof TabItem[])
      : [];

  return tabs;
});

// Watches
watch(
  () => active,
  (newActive): void => {
    tabActive.value = newActive;
    emit("tab", { tab: tabs.value[newActive], index: tabActive.value });
  },
  { immediate: true }
);

// Events
const onTabClick = (_tab: typeof TabItem, index: number): void => {
  tabActive.value = index;
  emit("tab", { tab: tabs.value[index], index: tabActive.value });
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tab-view {
  > .tab-headers {
    display: flex;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style-type: none;
    align-self: flex-start;
    border-bottom: 2px solid var(--c-lvl2);

    > .tab-header {
      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;
      padding: 1rem;

      user-select: none;
      color: var(--tab-text-color);
      font-weight: 500;

      &:hover {
        border-bottom: 2px solid var(--c-primary-active);
        margin: 0 0 -2px 0;
        color: var(--tab-text-color-hover);
      }

      &:active,
      &.active {
        border-bottom: 2px solid var(--c-primary);
        margin: 0 0 -2px 0;
        color: var(--tab-text-color-active);
      }
    }
  }
}
</style>
