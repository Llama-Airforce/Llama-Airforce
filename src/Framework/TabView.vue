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
import { watch, useSlots } from "vue";
import { $ref, $computed } from "vue/macros";
import TabItem from "@/Framework/TabItem.vue";

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
let tabActive = $ref<number | null>(null);

const slots = useSlots();
const tabs = $computed(() => {
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
    tabActive = newActive;
    emit("tab", { tab: tabs[tabActive], index: tabActive });
  },
  { immediate: true }
);

// Events
const onTabClick = (_tab: typeof TabItem, index: number): void => {
  tabActive = index;
  emit("tab", { tab: tabs[tabActive], index: tabActive });
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tab-view {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  > .tab-headers {
    display: flex;
    width: 100%;
    padding: 0;
    margin: 0;
    list-style-type: none;
    align-self: flex-start;
    border-bottom: 2px solid #27272a;

    > .tab-header {
      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;
      padding: 1rem;

      user-select: none;
      color: #71717a;
      font-weight: 500;

      &:hover {
        border-bottom: 2px solid lighten(lighten($blue, 12%), 12%);
        margin: 0 0 -2px 0;
        color: lighten(lighten($blue, 12%), 12%);
      }

      &:active,
      &.active {
        border-bottom: 2px solid $blue;
        margin: 0 0 -2px 0;
        color: $text;
      }
    }
  }
}

.tabs {
  display: flex;
  flex-grow: 1;

  > .tab {
    display: flex;
    flex-grow: 1;
  }
}
</style>
