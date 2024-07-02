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
        <ul>
          <li>
            <a
              class="nav-link"
              href="https://docs.llama.airforce/"
              target="_blank"
            >
              <div class="nav-link-container icon">
                <i class="fas fa-book"></i>
              </div>
            </a>
          </li>

          <li>
            <a
              class="nav-link"
              href="https://medium.com/@llamaairforce"
              target="_blank"
            >
              <div class="nav-link-container icon">
                <i class="fas fa-bullhorn"></i>
              </div>
            </a>
          </li>

          <li>
            <a
              class="nav-link"
              href="https://discord.gg/E3KHXkvzPJ"
              target="_blank"
            >
              <div class="nav-link-container icon">
                <i class="fab fa-discord"></i>
              </div>
            </a>
          </li>

          <li>
            <a
              class="nav-link"
              href="https://twitter.com/0xAlunara"
              target="_blank"
            >
              <div class="nav-link-container icon">
                <i class="fab fa-twitter"></i>
              </div>
            </a>
          </li>

          <li>
            <router-link
              to="/code"
              class="nav-link"
            >
              <div class="nav-link-container icon">
                <i class="fas fa-code"></i>
              </div>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

header {
  width: 100%;
  display: flex;

  background: $header-background;
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
      grid-row: 1;
      grid-column: 1;

      &:hover {
        background: unset;
      }

      display: flex;
      align-items: flex-end;

      color: #e8f0f8;
      font-weight: bold;
      line-height: 1.25rem;

      img {
        height: 75px;
        padding-right: 0.75rem;
      }
    }

    > .support {
      grid-row: 1;
      grid-column: 3;

      .icon {
        font-size: 1.25rem;
        color: var(--c-lvl5);

        height: 1.5rem;
        display: flex;
        align-items: center;
      }

      li:last-child {
        padding-right: 0;
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

      &.support {
        ul {
          flex-grow: 1;
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

          .nav-link {
            display: flex;
            justify-content: center;
            text-decoration: none;
            color: var(--c-text);
            border-bottom: $header-highlight-size solid $header-background;
            transition: all $header-hover-duration;

            .nav-link-container {
              height: 2rem;
              display: flex;
              flex-grow: 1;
              justify-content: center;
              align-items: center;
              padding: 0 0.5rem;

              border-bottom: $header-highlight-size solid transparent; // Empty bar to prevent stuff jumping around.
              transition: all $header-hover-duration;
            }

            &.disabled {
              opacity: 0.15;
              pointer-events: none;
            }

            &:hover:not(.disabled) {
              border-bottom: $header-highlight-size solid $header-primary;

              .nav-link-container {
                background-color: $header-button-hover;
                border-bottom: 1px solid $header-primary;
                color: $header-primary;
              }
            }

            &:active:not(.disabled) {
              .nav-link-container {
                background-color: $header-button-focus;
              }
            }
          }
        }
      }
    }
  }
}
</style>
