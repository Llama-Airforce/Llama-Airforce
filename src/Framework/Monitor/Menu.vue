<script setup lang="ts">
import { type Page } from "@/Framework/Monitor/Page";
import { type MenuItem as MenuItemT } from "@/Framework/Monitor/Menu";
import MenuItem from "@/Framework/Monitor/MenuItem.vue";

const { pages = [] } = defineProps<{
  pages: Page[];
}>();

const emit = defineEmits<{
  navigated: [];
}>();

// Refs
const route = useRoute();

const page = computed((): Page | undefined => {
  return pages.find((p) => subIsActive(p.titleRoute, route));
});

const menuItems = computed(() => {
  return page.value?.menuItems ?? [];
});

// Methods
const menuLabel = (item: MenuItemT): string => {
  return typeof item.label === "string" ? item.label : item.label();
};
</script>

<template>
  <nav>
    <ul
      v-for="menuItem in menuItems"
      :key="menuLabel(menuItem)"
    >
      <MenuItem
        :item="menuItem"
        @navigated="emit('navigated')"
      >
      </MenuItem>
    </ul>
  </nav>
</template>

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

    :deep(li) {
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

        &.root {
          cursor: pointer;

          &:not(:hover) {
            background: var(--c-lvl1);
          }
        }

        &:not(.root) {
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
