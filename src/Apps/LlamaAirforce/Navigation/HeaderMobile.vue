<template>
  <header>
    <div class="header-mobile">
      <div class="title">
        <img src="@/Assets/logo.svg" />
      </div>

      <Wallet class="wallet"></Wallet>
      <SelectLanguage
        class="language"
        direction="down"
      ></SelectLanguage>

      <nav class="support">
        <ul>
          <li>
            <a
              class="nav-link"
              href="https://etherscan.io/address/0x9Bc7c6ad7E7Cf3A6fCB58fb21e27752AC1e53f99"
              target="_blank"
            >
              <div class="nav-link-container donate">Donate</div>
            </a>
          </li>
        </ul>
      </nav>

      <button
        class="hamburger hamburger--spin"
        :class="{ 'is-active': menuOpen, open: menuOpen, closed: !menuOpen }"
        type="button"
        @click="toggleMenu"
      >
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
    </div>

    <MenuMobile
      :open="menuOpen"
      @closed="onNavigated"
      @navigated="onNavigated"
    ></MenuMobile>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SelectLanguage } from "@/Framework";
import Wallet from "@/Wallet/Wallet.vue";
import MenuMobile from "@LAF/Navigation/MenuMobile.vue";

// Refs
const menuOpen = ref(false);

// Methods
const toggleMenu = (): void => {
  menuOpen.value = !menuOpen.value;
  document.documentElement.style.overflow = menuOpen.value ? "hidden" : "";
};

const onNavigated = (): void => {
  menuOpen.value = false;
  document.documentElement.style.overflow = "";
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Styles/Hamburger.scss";

header {
  width: 100%;
  display: flex;

  background: $header-background;
  user-select: none;

  > .header-mobile {
    display: flex;
    align-items: center;
    gap: 1rem;

    height: 65px;
    width: 100%;
    margin: 0 1rem;
    font-size: 1rem;
    color: var(--c-lvl5);

    border-bottom: 1px solid var(--c-lvl2);

    > .title {
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
      flex-grow: 1;
    }

    > .language {
      width: 10rem;
      display: none;
    }

    > .support {
      display: none;
      flex-grow: 1;

      .donate {
        font-weight: 500;
        color: var(--c-primary);
      }
    }

    > .hamburger {
      padding-top: 5px;
      padding-left: 1.25rem;
      padding-right: 1rem;
      z-index: 21;
      -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.

      transition: transform 2 * $content-show-duration
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
