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

<style scoped>
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
  }
}
</style>
