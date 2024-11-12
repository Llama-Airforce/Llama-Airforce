<script setup lang="ts">
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
      class="nav-link leaf"
      :to="menuItem.to"
      :class="{ 'router-link-active': subIsActive(menuItem.to, route) }"
      @click="emit('navigated')"
    >
      <div class="nav-link-container">
        <component
          :is="menuItem.icon"
          v-if="menuItem.icon"
        />
        {{ menuItem.label }}
      </div>
    </router-link>

    <a
      v-else-if="menuItem"
      class="nav-link node"
      @click="onClickNode"
    >
      <div class="nav-link-container">
        <component
          :is="menuItem.icon"
          v-if="menuItem.icon"
        />
        {{ menuItem.label }}
      </div>
    </a>
  </li>
</template>

<style scoped>
li {
  display: flex;
  flex-direction: column;
  margin: 0.25rem 0;
  width: 100%;
}

i {
  display: flex;
  justify-content: center;
  min-width: 1.125rem;
  margin-right: 1rem;
}

.nav-link {
  font-weight: 500;

  display: flex;
  text-decoration: none;
  color: var(--c-text);
  transition: all var(--hover-duration);

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;

  &.node {
    color: var(--c-primary);
  }

  &.router-link-active {
    background: var(--c-lvl2);
  }

  &:not(.router-link-active) {
    color: var(--c-lvl5) !important;

    &:hover {
      color: hsl(from var(--c-lvl5) h s calc(l + 6 * var(--color-scheme-dark)));
      background: #1e1e21;
    }

    &:active {
      color: hsl(
        from var(--c-lvl5) h s calc(l + 12 * var(--color-scheme-dark))
      );
    }
  }

  .nav-link-container {
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding: 0.66rem 1rem;
    gap: 1rem;

    transition: all var(--hover-duration);

    &:active {
      background: hsl(
        from var(--c-lvl2) h s calc(l + 6 * var(--color-scheme-dark))
      );
    }

    @media only screen and (max-width: 1280px) {
      height: 50px;
      font-size: 1.75rem;

      > i {
        min-width: 2rem;
      }
    }
  }
}
</style>
