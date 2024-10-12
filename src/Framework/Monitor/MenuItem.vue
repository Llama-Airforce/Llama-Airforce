<script setup lang="ts">
import {
  isNode,
  isLeaf,
  isExternal,
  type MenuItem,
} from "@/Framework/Monitor/Menu";
import { subIsActive } from "@/Util";

const { item } = defineProps<{
  item: MenuItem;
}>();

const emit = defineEmits<{
  navigated: [];
}>();

// Refs
const route = useRoute();
const expanded = ref(true);

const items = computed(() => {
  if (isLeaf(item)) {
    return [item];
  } else if (isNode(item)) {
    return item.children;
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

// Methods
const menuLabel = (item: MenuItem): string => {
  return typeof item.label === "string" ? item.label : item.label();
};

// Watches
watch(
  () => item,
  (item) => {
    if (isNode(item)) {
      expanded.value = !item.initCollapsed;
    }

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
  <li v-if="isExternal(item)">
    <a
      class="nav-link root"
      :href="item.url"
      target="_blank"
    >
      <div class="nav-link-container">
        {{ item.label }}
      </div>
    </a>
  </li>

  <li v-else-if="isLeaf(item)">
    <router-link
      :to="item.to"
      class="nav-link root"
      :class="{ 'router-link-active': subIsActive(item.to, route) }"
      @click="emit('navigated')"
    >
      <div class="nav-link-container">
        <div class="left">
          <component
            :is="item.icon"
            v-if="item.icon"
            class="icon"
          />
          {{ menuLabel(item) }}
        </div>

        <div class="right">
          <Badge
            v-if="item.tag"
            :label="item.tag"
          ></Badge>
        </div>
      </div>
    </router-link>
  </li>

  <li v-else-if="isNode(item)">
    <a
      class="nav-link root"
      @click="onClickNode"
    >
      <div class="nav-link-container">
        {{ item.label }}
        <LucideChevronUp
          class="expander"
          :class="{ expanded }"
        />
      </div>
    </a>
  </li>

  <Collapsible
    v-if="isNode(item)"
    class="items"
    :expanded="expanded"
  >
    <ul>
      <li
        v-for="menuItem in items"
        :key="menuLabel(menuItem)"
      >
        <router-link
          v-if="isLeaf(menuItem)"
          :to="menuItem.to"
          class="nav-link"
          :class="{ 'router-link-active': subIsActive(menuItem.to, route) }"
          @click="emit('navigated')"
        >
          <div class="nav-link-container">
            <div class="left">
              <component
                :is="menuItem.icon"
                v-if="menuItem.icon"
                class="icon"
              />
              {{ menuLabel(menuItem) }}
            </div>

            <div class="right">
              <Badge
                v-if="menuItem.tag"
                :label="menuItem.tag"
              ></Badge>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </Collapsible>
</template>

<style scoped>
.nav-link {
  display: flex;
  font-weight: 500;
  text-decoration: none;
  color: var(--c-text);
  transition: all var(--hover-duration);
  margin: 0.125rem 1.125rem;

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--border-radius);

  .nav-link-container {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    align-items: center;
    margin-right: 1rem;
    padding: 0.75rem 0.75rem;

    transition: all var(--hover-duration);

    > .left {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      > .icon {
        width: 3ch;
        color: var(--c-primary);
      }
    }

    > .right {
      .badge {
        text-transform: uppercase;
      }
    }
  }

  &:hover {
    background: hsl(
      from var(--c-lvl2) h s calc(l + 6 * var(--color-scheme-dark))
    );
  }

  &:active {
    background: hsl(
      from var(--c-lvl2) h s calc(l + 12 * var(--color-scheme-dark))
    );

    &:not(.router-link-active) {
      color: var(--c-text) !important;
    }
  }

  &.root {
    color: var(--c-text) !important;
    font-weight: 600;

    cursor: pointer;

    &:not(:hover) {
      background: var(--c-lvl1);
    }

    .nav-link-container .expander {
      font-size: 0.75rem;
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }

  &:not(.root) {
    &.router-link-active {
      background: var(--c-lvl3);
    }

    &:not(.router-link-active) {
      color: hsl(
        from var(--c-text) h calc(s * 0.5)
          calc(l - 32 * var(--color-scheme-dark))
      );
    }

    .nav-link-container {
      margin-left: 0.75rem;
    }
  }
}

.items {
  display: grid;
  padding: 0;
  margin: 0;
  list-style-type: none;

  transition: grid-template-rows 125ms ease-out;

  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
}
</style>
