<script setup lang="ts">
import MenuItem from "@LAF/Navigation/MenuItem.vue";
import { type PageLAF } from "@LAF/Pages/Page";

const { open = false } = defineProps<{
  open?: boolean;
}>();

const emit = defineEmits<{
  closed: [];
  navigated: [];
}>();

// Refs
const pageStore = usePageStore<PageLAF>();
const route = useRoute();
const router = useRouter();
const page = ref("Curve");

const titleRoute = computed(() => {
  const titleRoute = pageStore.pages.find(
    (p) => p.title === page.value
  )?.titleRoute;

  if (typeof titleRoute === "string") return titleRoute;
  else if (Array.isArray(titleRoute)) return titleRoute[0];
  else return null;
});

const menuItems = computed(() => {
  return pageStore.pages.find((p) => p.title === page.value)?.menuItems ?? [];
});

const pages = computed((): string[] => {
  return pageStore.pages.filter((p) => p.visible).map((p) => p.title);
});

// Events
const onPageSelect = async (option: string) => {
  page.value = option;

  if (menuItems.value.length === 0) {
    const route = titleRoute.value;
    if (route) {
      await router.push(route);
      emit("navigated");
    }
  }
};

// Watches
watch(
  () => open,
  (): void => {
    page.value =
      pageStore.pages.find((p) => subIsActive(p.titleRoute, route))?.title ??
      "Curve";
  }
);
</script>

<template>
  <div class="menu-mobile">
    <div
      class="overlay"
      :class="{ open, closed: !open }"
      @click="emit('closed')"
    ></div>

    <div
      class="menu"
      :class="{ open, closed: !open }"
    >
      <Select
        class="select-menu"
        :options="pages"
        :selected="page"
        @input="onPageSelect"
      ></Select>

      <nav class="navigation">
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

      <SelectLanguage
        class="language"
        direction="up"
      ></SelectLanguage>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-mobile {
  > .overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: black;
    z-index: 20;

    transition: opacity calc(2 * var(--hover-duration))
        cubic-bezier(0.65, 0.05, 0.36, 1),
      visibility calc(2 * var(--hover-duration))
        cubic-bezier(0.65, 0.05, 0.36, 1);

    &.closed {
      visibility: hidden;
      opacity: 0;
    }

    &.open {
      visibility: visible;
      opacity: 0.8;
    }
  }

  > .menu {
    display: flex;
    flex-direction: column;

    position: fixed;
    height: 100%;
    right: 0;
    z-index: 20;
    background: var(--c-lvl0);
    padding: 1.25rem;
    visibility: hidden;
    overflow-y: auto;

    width: 300px;

    transition: visibility calc(2 * var(--hover-duration))
        cubic-bezier(0.65, 0.05, 0.36, 1),
      transform calc(2 * var(--hover-duration))
        cubic-bezier(0.65, 0.05, 0.36, 1),
      opacity calc(2 * var(--hover-duration)) cubic-bezier(0.65, 0.05, 0.36, 1);

    &.closed {
      visibility: hidden;
      opacity: 0;
      /* transform: translateX(calc(200px + 1.25rem)); */
    }

    &.open {
      visibility: visible;
      opacity: 1;
      /* transform: translateX(0); */
    }

    :deep(> .select-menu) {
      .chevrons {
        font-size: 1rem;
        right: 1.75rem;
      }

      .selected {
        line-height: 4rem;
        font-size: 1.75rem;
        padding: 0 2rem;
      }

      .items {
        line-height: 4rem;
        font-size: 1.75rem;
        margin-top: 4.25rem;

        > div {
          padding: 0.5rem 2rem;
        }
      }
    }

    nav {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--c-lvl2);

      ul {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin: 0;
        list-style-type: none;

        :deep(li) {
          display: flex;
          flex-direction: column;
          margin: 0.25rem 0;
          width: 100%;

          .nav-link {
            display: flex;
            text-decoration: none;
            color: var(--c-text);
            transition: all var(--hover-duration);
            height: 50px;
            font-size: 1.75rem;

            &.router-link-active {
              background: var(--c-lvl2);
            }

            &:not(.router-link-active) {
              color: var(--c-lvl5);

              &:hover {
                color: var(--c-lvl5-hover);
                background: #1e1e21;
              }

              &:active {
                color: var(--c-lvl5-active);
              }
            }

            .nav-link-container {
              display: flex;
              flex-grow: 1;
              align-items: center;
              padding: 0.66rem 1rem;

              transition: all var(--hover-duration);

              &:active {
                background: var(--c-lvl2-hover);
              }

              > i {
                min-width: 2rem;
              }
            }
          }
        }
      }
    }
  }

  :deep(.language) {
    margin-bottom: calc(2 * 1.25rem);

    .chevrons {
      font-size: 1rem;
      top: 2.5rem;
      right: 1.75rem;
    }

    .item .label {
      font-size: 1.75rem;
    }

    .selected,
    .items {
      line-height: 4rem !important;
    }
  }
}
</style>
