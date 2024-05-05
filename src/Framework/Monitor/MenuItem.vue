<template>
  <li v-if="isNode(item)">
    <a
      class="nav-link node"
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
          class="nav-link leaf"
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
              <Chip
                v-if="menuItem.tag === 'beta'"
                label="BETA"
              ></Chip>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
  </Collapsible>
</template>

<script setup lang="ts">
import { Chip, Collapsible } from "@/Framework";
import { type MenuItem, isNode, isLeaf } from "@/Framework/Monitor";
import { subIsActive } from "@/Util";

// Props
interface Props {
  item: MenuItem;
}

const { item } = defineProps<Props>();

// Emits
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
  }

  &.node {
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
