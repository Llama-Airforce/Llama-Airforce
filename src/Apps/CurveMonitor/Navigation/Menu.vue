<template>
  <nav>
    <ul
      v-for="menuItem in menuItems"
      :key="menuItem.label"
    >
      <MenuItem
        :item="menuItem"
        @navigated="emit('navigated')"
      >
      </MenuItem>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { subIsActive } from "@/Util";
import MenuItem from "@CM/Navigation/MenuItem.vue";
import type { Page } from "@CM/Pages/Page";
import { usePageStore } from "@CM/Pages/Store";

// Emits
const emit = defineEmits<{
  (e: "navigated"): void;
}>();

// Refs
const pageStore = usePageStore();
const route = useRoute();

const page = computed((): Page | undefined => {
  return pageStore.pages.find((p) => subIsActive(p.titleRoute, route));
});

const menuItems = computed(() => {
  return page.value?.menuItems ?? [];
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

nav {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  overflow-y: auto;

  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    list-style-type: none;

    ::v-deep(li) {
      display: flex;
      flex-direction: column;

      .nav-link {
        display: flex;
        text-decoration: none;
        color: var(--c-text);
        transition: all $header-hover-duration;
        margin: 0.125rem 1.125rem;

        &:hover {
          background: var(--c-lvl2-hover);
        }

        &:active {
          background: var(--c-lvl2-active);

          &:not(.router-link-active) {
            color: var(--c-text) !important;
          }
        }

        &.node {
          background: var(--c-lvl1);
          cursor: pointer;
        }

        &:not(.node) {
          &.router-link-active {
            background: var(--c-lvl3);
          }

          &:not(.router-link-active) {
            color: var(--c-lvl5);
          }

          .nav-link-container {
            margin-left: 0.75rem;
          }
        }

        .nav-link-container {
          display: flex;
          flex-grow: 1;
          align-items: center;
          padding: 0.75rem 0.75rem;

          transition: all $header-hover-duration;
        }
      }
    }
  }
}
</style>
