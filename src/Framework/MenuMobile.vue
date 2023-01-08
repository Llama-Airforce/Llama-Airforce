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
        class="select"
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
            @click="emit('navigated')"
          >
          </MenuItem>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { useRoute } from "vue-router";
import { MenuItem, Select } from "@/Framework";
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
let page = $ref("Curve");
let pageOpen = $ref(false);

const menuItems = $computed(() => {
  return pageStore.pages.find((p) => p.title === page)?.menuItems ?? [];
});

const pages = $computed((): string[] => {
  return pageStore.pages.filter((p) => p.visible).map((p) => p.title);
});

// Events
const onPageOpen = (): void => {
  pageOpen = !pageOpen;
};

const onPageSelect = (option: unknown): void => {
  page = option as string;
};

// Watches
watch(
  () => open,
  (): void => {
    page =
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
    position: fixed;
    height: 100%;
    right: 0;
    z-index: 20;
    background: $header-background;
    padding: 1.25rem;
    visibility: hidden;

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

    ::v-deep(> .select) {
      padding-bottom: 2rem;
      border-bottom: 1px solid $level2-color;

      .chevrons {
        font-size: 1rem;
        top: 2.5rem;
        right: 1.75rem;
      }

      .selected {
        line-height: 4rem;
        font-size: 1.75rem;
        padding: 0.5rem 2rem;
      }

      .items {
        line-height: 4rem;
        font-size: 1.75rem;

        > div {
          padding: 0.5rem 2rem;
        }
      }
    }

    nav {
      margin-top: 2rem;

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
}
</style>
