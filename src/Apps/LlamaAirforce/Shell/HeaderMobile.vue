<script setup lang="ts">
import MenuMobile from "./MenuMobile.vue";

const menuOpen = ref(false);

// Methods
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  document.documentElement.style.overflow = menuOpen.value ? "hidden" : "";
};

const onNavigated = () => {
  menuOpen.value = false;
  document.documentElement.style.overflow = "";
};
</script>

<template>
  <header>
    <div class="header-mobile">
      <div class="title">
        <img src="@/Assets/Menu/logo.svg" />
      </div>

      <div class="wallet">
        <Wallet class="wallet" />
        <LlamaNFT />
      </div>

      <LucideMenu
        class="hamburger"
        :class="{ 'is-active': menuOpen, open: menuOpen, closed: !menuOpen }"
        @click="toggleMenu"
      />
    </div>

    <MenuMobile
      :open="menuOpen"
      @closed="onNavigated"
      @navigated="onNavigated"
    />
  </header>
</template>

<style scoped>
header {
  width: 100%;

  background: var(--c-lvl0);
  user-select: none;

  > .header-mobile {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 2rem;

    height: 65px;
    width: 100%;
    margin: 0 1rem;
    font-size: 1rem;
    color: var(--c-lvl5);

    border-bottom: 1px solid var(--c-lvl2);

    > .title {
      grid-row: 1;
      grid-column: 1;

      display: flex;
      align-items: flex-end;
      pointer-events: none;

      color: #e8f0f8;
      font-weight: bold;
      line-height: 1.25rem;

      img {
        height: 50px;
      }
    }

    > .wallet {
      grid-row: 1;
      grid-column: 1 / -1;
      justify-self: center;

      display: flex;
      align-items: center;
      gap: 1rem;

      button {
        min-width: 8rem;
      }

      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }

    > .hamburger {
      grid-row: 1;
      grid-column: 3;

      height: 100%;
      display: flex;
      align-items: center;
      color: white;
      font-size: 1.5rem;
      padding-inline: 1rem;

      z-index: 21;

      /* Disable blue highlight because of pointer. */
      -webkit-tap-highlight-color: transparent;

      transition: transform calc(2 * var(--hover-duration))
        cubic-bezier(0.65, 0.05, 0.36, 1);

      &.closed {
        transform: translateX(0);
      }

      &.open {
        transform: translateX(calc(-300px - 2.5rem));
      }
    }

    nav {
      display: flex;
      justify-content: center;

      &.support {
        ul {
          justify-content: space-between;
        }
      }

      ul {
        display: flex;
        padding: 0;
        margin: 0;
        list-style-type: none;

        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-right: 0.5rem;
          padding-left: 0.5rem;
        }
      }
    }
  }
}
</style>
