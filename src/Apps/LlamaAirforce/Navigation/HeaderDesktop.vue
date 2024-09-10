<script setup lang="ts">
import { subIsActive } from "@/Util";
import { type PageLAF } from "@LAF/Pages/Page";
import Wallet from "@/Wallet/Wallet.vue";

const pageStore = usePageStore<PageLAF>();
const route = useRoute();

const pages = computed(() => pageStore.pages.filter((p) => p.visible));

const planeX = computed((): string => {
  let x = 15;

  for (const page of pageStore.pages) {
    if (subIsActive(page.titleRoute, route)) {
      x = page.planeX;
      break;
    }
  }

  return `transform: scale(0.75) translateX(${x}px);`;
});
</script>

<template>
  <header>
    <div class="header-desktop">
      <router-link
        to="/"
        class="title"
      >
        <img src="@/Assets/Menu/logo.svg" />
      </router-link>

      <nav class="navigation">
        <ul>
          <!-- Vroooom -->
          <span class="plane">
            <i
              class="fas fa-plane"
              :style="planeX"
            >
            </i>
          </span>

          <img src="@/Assets/Menu/header-edge.png" />

          <template
            v-for="(page, index) in pages"
            :key="page.title"
          >
            <li>
              <router-link
                :to="
                  Array.isArray(page.titleRoute)
                    ? page.titleRoute[0]
                    : page.titleRoute
                "
                class="nav-link"
                :class="{
                  'router-link-active': subIsActive(page.titleRoute, route),
                }"
              >
                <div class="nav-link-container">{{ page.title }}</div>
              </router-link>
            </li>

            <img
              v-if="index < pages.length - 1"
              src="@/Assets/Menu/header-separator.png"
            />
          </template>

          <img src="@/Assets/Menu/header-edge.png" />
        </ul>
      </nav>

      <nav class="support">
        <Wallet></Wallet>
        <LlamaNFT></LlamaNFT>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  display: flex;

  background: var(--c-lvl0);
  user-select: none;

  > .header-desktop {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

    height: 110px;
    width: 100%;
    max-width: 1360px;
    padding: 0 2.5rem;
    font-size: 1rem;
    color: var(--c-lvl5);

    border-bottom: 1px solid var(--c-lvl2);

    > .title {
      /* Needed because the menu is rendered on top, otherwise breaking clicking the logo. */
      z-index: 1;

      grid-row: 1;
      grid-column: 1;

      display: flex;
      align-items: flex-end;

      color: #e8f0f8;
      font-weight: bold;
      line-height: 1.25rem;

      &:hover {
        background: unset;
      }

      img {
        height: 75px;
        padding-right: 0.75rem;
      }
    }

    > .support {
      grid-row: 1;
      grid-column: 3;

      display: flex;
      gap: 1rem;
      align-items: center;

      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }

    > .navigation {
      grid-row: 1;
      grid-column: 1 / -1;

      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center;

      /** Left edge image */
      img:nth-of-type(1) {
        padding-left: 0;
        padding-right: 2rem;
      }

      /** Right edge image */
      img:last-of-type {
        padding-left: 2rem;
        padding-right: 0;
      }

      img {
        object-fit: scale-down;
        pointer-events: none;
        padding: 0 0.5rem;
      }

      .plane {
        position: relative;
        display: flex;
        align-items: center;
        width: 0;

        > i {
          position: absolute;
          color: white;
          z-index: 1;
          transition: 0.55s cubic-bezier(0.65, 0.05, 0.36, 1);
        }
      }

      > ul {
        padding: 3px 0;
        border-top: var(--border-thickness) solid #52525b;
        border-bottom: var(--border-thickness) solid #52525b;

        > li {
          padding: 0;
          width: 100%;

          .nav-link {
            font-weight: 500;

            &:not(.router-link-active):not(.disabled) {
              opacity: 0.35;

              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }

    nav {
      display: flex;
      justify-content: center;

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

          .nav-link {
            display: flex;
            justify-content: center;
            text-decoration: none;
            color: var(--c-text);
            border-bottom: 1px solid var(--c-lvl0);
            transition: all var(--hover-duration);

            .nav-link-container {
              height: 2rem;
              display: flex;
              flex-grow: 1;
              justify-content: center;
              align-items: center;
              padding: 0 0.5rem;

              /* Empty bar to prevent stuff jumping around. */
              border-bottom: 1px solid transparent;
              transition: all var(--hover-duration);
            }

            &.disabled {
              opacity: 0.15;
              pointer-events: none;
            }

            &:hover:not(.disabled) {
              border-bottom: 1px solid var(--c-lvl0);

              .nav-link-container {
                background-color: var(--c-lvl6);
                border-bottom: 1px solid var(--c-lvl0);
                color: var(--c-lvl0);
              }
            }

            &:active:not(.disabled) {
              .nav-link-container {
                background-color: var(--c-lvl6);
              }
            }
          }
        }
      }
    }
  }
}
</style>
