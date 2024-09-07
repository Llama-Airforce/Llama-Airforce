<script setup lang="ts">
import { subIsActive } from "@/Util";
import { type MenuItem, isNode, isLeaf } from "@LAF/Pages/Page";

const { item } = defineProps<{
  item: MenuItem;
}>();

const emit = defineEmits<{
  navigated: [];
}>();

// Refs
const route = useRoute();
const expanded = ref(false);

const items = computed(() => {
  if (isLeaf(item)) {
    return [item];
  } else if (isNode(item)) {
    return [item, ...(expanded.value ? item.children : [])];
  } else {
    return [];
  }
});

// Methods
const expandIfChildActive = () => {
  if (isNode(item)) {
    const isOnChildPage =
      item.children.filter((item) => subIsActive(item.to, route)).length > 0;

    if (isOnChildPage) {
      expanded.value = true;
    }
  }
};

// Watches
watch(
  () => item,
  () => {
    expandIfChildActive();
  },
  { immediate: true }
);

watch(
  () => route.fullPath,
  () => {
    expandIfChildActive();
  },
  { immediate: true }
);

const onClickNode = (): void => {
  expanded.value = !expanded.value;
};
</script>

<template>
  <li
    v-for="menuItem in items"
    :key="menuItem.label"
  >
    <router-link
      v-if="isLeaf(menuItem)"
      :to="menuItem.to"
      class="nav-link leaf"
      :class="{ 'router-link-active': subIsActive(menuItem.to, route) }"
      @click="emit('navigated')"
    >
      <div class="nav-link-container">
        <i
          v-if="menuItem.icon"
          :class="menuItem.icon"
        ></i>
        <i v-else></i>
        {{ menuItem.label }}
      </div>
    </router-link>

    <a
      v-else-if="menuItem"
      class="nav-link node"
      @click="onClickNode"
    >
      <div class="nav-link-container">
        <i
          v-if="menuItem.icon"
          :class="menuItem.icon"
        ></i>
        {{ menuItem.label }}
      </div>
    </a>
  </li>
</template>

<style lang="scss" scoped>
i {
  display: flex;
  justify-content: center;
  min-width: 1.125rem;
  margin-right: 1rem;
}

.nav-link {
  font-weight: 500;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.

  &.node {
    color: var(--c-primary) !important;
  }
}
</style>
