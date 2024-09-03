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
          <div
            v-if="item.icon"
            class="icon"
          >
            <i :class="item.icon"></i>
          </div>
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
        <i
          class="expander fas fa-chevron-up"
          :class="{ expanded }"
        ></i>
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
              <div
                v-if="menuItem.icon"
                class="icon"
              >
                <i :class="menuItem.icon"></i>
              </div>
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.nav-link {
  font-weight: 500;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  border-radius: var(--border-radius);

  .nav-link-container {
    justify-content: space-between;
    margin-right: 1rem;

    > .left {
      display: flex;
      gap: 0.5rem;

      > .icon {
        width: 3ch;
        text-align: center;
        color: var(--c-primary);
      }
    }

    > .right {
      .badge {
        text-transform: uppercase;
      }
    }
  }

  &.root {
    color: var(--c-text) !important;
    font-weight: 600;

    .nav-link-container .expander {
      font-size: 0.75rem;
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(180deg);
      }
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
