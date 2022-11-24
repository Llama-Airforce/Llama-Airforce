<template>
  <div
    class="menu-desktop"
    :class="{ hasMenu }"
  >
    <div class="sticky-wrapper">
      <div class="title">
        <img :src="menuHeader" />
      </div>

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

      <Wallet
        v-if="hasMenu"
        class="wallet"
      ></Wallet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
import MenuItem from "@/Framework/MenuItem.vue";
import Wallet from "@/Wallet/Wallet.vue";
import type { Page } from "@/Pages/Page";
import { subIsActive } from "@/Util/RouterHelper";
import { usePageStore } from "@/Pages/Store";

// Emits
const emit = defineEmits<{
  (e: "navigated"): void;
}>();

// Refs
const pageStore = usePageStore();
const route = useRoute();

const page = $computed((): Page | undefined => {
  return pageStore.pages.find((p) => subIsActive(p.titleRoute, route));
});

const menuHeader = $computed(() => {
  return page?.menuHeader ?? "";
});

const menuItems = $computed(() => {
  return page?.menuItems ?? [];
});

const hasMenu = $computed((): boolean => {
  return menuItems.length > 0;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.menu-desktop {
  background: $header-background;
  user-select: none;

  $menu-width: 223px;
  width: 0;

  &.hasMenu {
    width: $menu-width;
    transition: width $content-show-duration $ease-out;

    padding: 0 1.5rem 0 2.5rem;
    border-right: 1px solid #27272a;
  }

  margin: 1.5rem 0;
  font-size: 1rem;

  > .sticky-wrapper {
    position: sticky;
    top: 2rem;

    display: flex;
    flex-direction: column;

    > .title {
      margin-bottom: 1rem;
      height: 38px;

      img {
        pointer-events: none;
      }
    }

    > .wallet {
      position: fixed;
      bottom: 2rem;
      width: $menu-width;
    }

    > .navigation {
      display: flex;
      flex-direction: column;
      height: 70vh;
    }

    nav {
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
            }
          }
        }
      }
    }
  }
}
</style>
