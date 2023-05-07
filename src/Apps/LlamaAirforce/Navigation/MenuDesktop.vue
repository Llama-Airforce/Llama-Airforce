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
            @navigated="emit('navigated')"
          >
          </MenuItem>
        </ul>
      </nav>

      <div class="bottom">
        <LlamaNFT></LlamaNFT>
        <SelectLanguage></SelectLanguage>
        <Wallet
          v-if="hasMenu"
          :label-please-connect="t('please-connect')"
        ></Wallet>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { SelectLanguage } from "@/Framework";
import LlamaNFT from "@/Framework/LlamaNFT.vue";
import { subIsActive } from "@/Util";
import Wallet from "@/Wallet/Wallet.vue";
import MenuItem from "@LAF/Navigation/MenuItem.vue";
import type { Page } from "@LAF/Pages/Page";
import { usePageStore } from "@LAF/Pages/Store";

const { t } = useI18n();

// Emits
const emit = defineEmits<{
  (e: "navigated"): void;
}>();

// Refs
const pageStore = usePageStore();
const route = useRoute();

const page = computed((): Page | undefined => {
  return pageStore.pages.find((p) => subIsActive(p.titleRoute, route));
});

const menuHeader = computed(() => {
  return page.value?.menuHeader ?? "";
});

const menuItems = computed(() => {
  return page.value?.menuItems ?? [];
});

const hasMenu = computed((): boolean => {
  return menuItems.value.length > 0;
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
    border-right: 1px solid var(--c-lvl2);

    > .sticky-wrapper {
      > .bottom {
        width: $menu-width;
        transition: width $content-show-duration $ease-out;
        overflow: visible;
      }
    }
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

    > .bottom {
      position: fixed;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      bottom: 2rem;
      overflow: hidden;
      width: 0px;
      transition: width $content-show-duration $ease-in;
    }

    > .navigation {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: auto;
      max-height: 680px;
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
            color: var(--c-text);
            transition: all $header-hover-duration;

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

              transition: all $header-hover-duration;

              &:active {
                background: var(--c-lvl2-hover);
              }
            }
          }
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
please-connect: Connect your wallet to see your personal earnings in each round
</i18n>
