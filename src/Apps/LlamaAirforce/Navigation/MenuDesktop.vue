<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";
import MenuItem from "@LAF/Navigation/MenuItem.vue";
import { usePageStore } from "@LAF/Pages/PageStore";

const { t } = useI18n();

const emit = defineEmits<{
  navigated: [];
}>();

// Refs
const pageStore = usePageStore();
const route = useRoute();

const page = computed(() =>
  pageStore.pages.find((p) => subIsActive(p.titleRoute, route))
);

const menuHeader = computed(() => page.value?.menuHeader ?? "");
const menuItems = computed(() => page.value?.items ?? []);

const hasMenu = computed(
  () => menuItems.value.length > 0 || !!page.value?.forceShowMenu
);
</script>

<template>
  <div
    class="menu-desktop"
    :class="{ hasMenu }"
  >
    <div class="sticky-wrapper">
      <div
        v-if="hasMenu"
        class="title"
      >
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

<style scoped>
.menu-desktop {
  background: var(--c-lvl0);
  user-select: none;

  --menu-width: 223px;
  width: 0;

  margin: 1.5rem 0;
  font-size: 1rem;

  &.hasMenu {
    width: var(--menu-width);
    transition: width var(--hover-duration) cubic-bezier(0.4, 0, 1, 1);

    padding: 0 1.5rem 0 2.5rem;
    border-right: 1px solid var(--c-lvl2);

    > .sticky-wrapper {
      > .bottom {
        width: var(--menu-width);
        transition: width var(--hover-duration) cubic-bezier(0.4, 0, 1, 1);
        overflow: visible;
      }
    }
  }

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
      transition: width var(--hover-duration) cubic-bezier(0, 0, 0.2, 1);
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
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
please-connect: Connect your wallet to see your personal earnings in each round
</i18n>
