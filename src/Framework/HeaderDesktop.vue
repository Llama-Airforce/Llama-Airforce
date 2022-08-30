<template>
  <header>
    <div class="header-desktop">
      <router-link
        to="/"
        class="title"
      >
        <img src="@/Assets/logo.png" />Llama<br />Airforce
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

          <img src="@/Assets/header-edge.png" />

          <img src="@/Assets/header-separator.png" />

          <template
            v-for="page in pageStore.pages"
            :key="page.title"
          >
            <li>
              <router-link
                :to="page.titleRoute"
                class="nav-link"
                :class="{
                  'router-link-active': subIsActive(page.titleRoute, route),
                }"
              >
                <div class="nav-link-container">{{ page.title }}</div>
              </router-link>
            </li>

            <img src="@/Assets/header-separator.png" />
          </template>

          <img src="@/Assets/header-edge.png" />
        </ul>
      </nav>

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
              to="/contracts"
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

<script
  setup
  lang="ts"
>
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
import { subIsActive } from "@/Util/RouterHelper";
import { usePageStore } from "@/Pages/Store";

const pageStore = usePageStore();
const route = useRoute();

const planeX = $computed((): string => {
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

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

header {
  width: 100%;
  display: flex;

  background: $header-background;
  user-select: none;

  > .header-desktop {
    display: flex;
    align-items: center;

    height: 110px;
    width: 100%;
    padding: 0 2.5rem;
    font-size: 1rem;
    color: #71717a;

    border-bottom: 1px solid #27272a;

    > .title {
      &:hover {
        background: unset;
      }

      display: flex;
      align-items: flex-end;

      color: #e8f0f8;
      font-weight: bold;
      line-height: 1.25rem;

      img {
        width: 50px;
        height: 50px;
        padding-right: 0.75rem;
      }
    }

    > .support {
      .donate {
        font-weight: 500;
        color: $blue;
      }

      .icon {
        font-size: 1.25rem;
        color: #71717a;

        height: 1.5rem;
        display: flex;
        align-items: center;
      }

      li:last-child {
        padding-right: 0;
      }
    }

    > .navigation {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      align-items: center;

      /** Left edge image */
      img:nth-of-type(1) {
        padding-left: 0;
        padding-right: 0.5rem;
      }

      /** Right edge image */
      img:last-of-type {
        padding-left: 0.5rem;
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
        border-top: 2px solid #52525b;
        border-bottom: 2px solid #52525b;

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
            color: $text;
            border-bottom: $header-highlight-size solid $header-background;
            transition: all $header-hover-duration;

            .nav-link-container {
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
