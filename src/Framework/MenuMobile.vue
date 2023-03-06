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
        :open="pageOpen"
        @open="onPageOpen"
        @close="pageOpen = false"
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

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { MenuItem, Select, SelectLanguage } from "@/Framework";
import { subIsActive } from "@/Util";
import { usePageStore } from "@/Pages/Store";

// Props
interface Props {
  open?: boolean;
}

const { open = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "closed"): void;
  (e: "navigated"): void;
}>();

// Refs
const pageStore = usePageStore();
const route = useRoute();
const page = ref("Curve");
const pageOpen = ref(false);

const menuItems = computed(() => {
  return pageStore.pages.find((p) => p.title === page.value)?.menuItems ?? [];
});

const pages = computed((): string[] => {
  return pageStore.pages.filter((p) => p.visible).map((p) => p.title);
});

// Events
const onPageOpen = (): void => {
  pageOpen.value = !pageOpen.value;
};

const onPageSelect = (option: unknown): void => {
  page.value = option as string;
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.menu-mobile {
  > .overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: black;
    z-index: 20;

    transition: opacity 2 * $content-show-duration
        cubic-bezier(0.65, 0.05, 0.36, 1),
      visibility 2 * $content-show-duration cubic-bezier(0.65, 0.05, 0.36, 1);

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
    background: $header-background;
    padding: 1.25rem;
    visibility: hidden;
    overflow-y: auto;

    width: 300px;

    transition: visibility 2 * $content-show-duration
        cubic-bezier(0.65, 0.05, 0.36, 1),
      transform 2 * $content-show-duration cubic-bezier(0.65, 0.05, 0.36, 1),
      opacity 2 * $content-show-duration cubic-bezier(0.65, 0.05, 0.36, 1);

    &.closed {
      visibility: hidden;
      opacity: 0;
      //transform: translateX(calc(200px + 1.25rem));
    }

    &.open {
      visibility: visible;
      opacity: 1;
      //transform: translateX(0);
    }

    ::v-deep(> .select-menu) {
      .chevrons {
        font-size: 1rem;
        top: 2.5rem;
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
      border-top: 1px solid $level2-color;

      ul {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin: 0;
        list-style-type: none;

        ::v-deep(li) {
          display: flex;
          flex-direction: column;
          margin: 0.25rem 0;
          width: 100%;

          .nav-link {
            display: flex;
            text-decoration: none;
            color: $text;
            transition: all $header-hover-duration;
            height: 50px;
            font-size: 1.75rem;

            &.router-link-active {
              background: $level2-color;
            }

            &:not(.router-link-active) {
              color: $level5-color;

              &:hover {
                color: lighten($level5-color, 6%);
                background: #1e1e21;
              }

              &:active {
                color: lighten($level5-color, 12%);
              }
            }

            .nav-link-container {
              display: flex;
              flex-grow: 1;
              align-items: center;
              padding: 0.66rem 1rem;

              transition: all $header-hover-duration;

              &:active {
                background: lighten($level2-color, 6%);
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

  ::v-deep(.language) {
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
