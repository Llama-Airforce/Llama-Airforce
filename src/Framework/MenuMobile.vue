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
      <div
        class="page"
        tabindex="0"
        @click.stop="onPageOpen"
        @blur="pageOpen = false"
      >
        <Select
          class="select"
          :options="pages"
          :selected="page"
          :open="pageOpen"
          @input="onPageSelect"
        ></Select>

        <div class="selector">
          <i class="fas fa-chevron-up"></i>
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>

      <nav class="navigation">
        <ul
          v-for="menuItem in menuItems"
          :key="menuItem.label"
        >
          <MenuItem
            :to="menuItem.to"
            :icon="menuItem.icon"
            :label="menuItem.label"
            @click="emit('navigated')"
          >
          </MenuItem>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { watch } from "vue";
import { $ref, $computed } from "vue/macros";
import { useRoute } from "vue-router";
import { usePageStore } from "@/Pages/Store";
import MenuItem from "@/Framework/MenuItem.vue";
import Select from "@/Framework/Select.vue";
import { subIsActive } from "@/Util/RouterHelper";

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
  return pageStore.pages.map((p) => p.title);
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

<style
  lang="scss"
  scoped
>
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

    > .page {
      position: relative;
      padding-bottom: 2rem;
      border-bottom: 1px solid #27272a;

      .selector {
        position: absolute;
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        top: 1rem;
        right: 1.75rem;
      }

      ::v-deep(> .select) {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
        transition: background $hover-duration;

        background: lighten($background-color-widget, 6%);
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

        &:hover {
          background: lighten($background-color-widget, 12%);
        }

        > .selected {
          font-size: 1.75rem;
          padding: 1.35rem 2rem;
        }

        > .items {
          margin-top: 0.5rem;
          right: 10px;
          left: 0;
          line-height: 4rem;
          font-size: 1.75rem;
          width: 100%;

          > div {
            padding: 0.5rem 2rem;
          }
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
              background: #27272a;
            }

            &:not(.router-link-active) {
              color: #71717a;

              &:hover {
                color: lighten(#71717a, 6%);
                background: #1e1e21;
              }

              &:active {
                color: lighten(#71717a, 12%);
              }
            }

            .nav-link-container {
              display: flex;
              flex-grow: 1;
              align-items: center;
              padding: 0.66rem 1rem;

              transition: all $header-hover-duration;

              &:active {
                background: lighten(#27272a, 6%);
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
