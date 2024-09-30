<script setup lang="ts">
import type { Menu, MenuItem as MenuItemT } from "@/Framework/Monitor/Menu";
import MenuItem from "@/Framework/Monitor/MenuItem.vue";

const { menu } = defineProps<{
  menu: Menu;
}>();

const emit = defineEmits<{
  navigated: [];
}>();

const label = (item: MenuItemT): string => {
  return typeof item.label === "string" ? item.label : item.label();
};
</script>

<template>
  <nav>
    <ul
      v-for="item in menu.items"
      :key="label(item)"
    >
      <MenuItem
        :item
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
