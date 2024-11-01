<script setup lang="ts">
import { usePageStore } from "@LAF/Pages/PageStore";

const pageStore = usePageStore();
const route = useRoute();

const page = computed(() =>
  pageStore.pages.find((p) => subIsActive(p.titleRoute, route))
);

const menuItems = computed(() => page.value?.items ?? []);

const noMenu = computed(
  () => !(menuItems.value.length > 0 || !!page.value?.forceShowMenu)
);
</script>

<template>
  <footer :class="{ 'no-language': !noMenu }">
    <SelectLanguage v-if="noMenu" />

    <nav>
      <ul>
        <li>
          <a
            class="nav-link"
            href="https://docs.llama.airforce/"
            target="_blank"
          >
            <div class="nav-link-container icon">
              <LucideBook />
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
              <LucideMegaphone />
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
              <div class="discord"></div>
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
              <LucideTwitter />
            </div>
          </a>
        </li>

        <li>
          <router-link
            to="/code"
            class="nav-link"
          >
            <div class="nav-link-container icon">
              <LucideCode />
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  margin: 0rem 1rem 2rem 1.5rem;
  align-items: center;
  justify-content: space-between;

  @media only screen and (max-width: 1280px) {
    margin-left: 1.5rem;
    margin-right: 1rem;
  }

  &.no-language {
    justify-content: flex-end;
  }

  .select {
    width: 8rem;
  }

  nav {
    ul {
      display: flex;
      gap: 1rem;
      padding: 0;
      margin: 0;
      list-style-type: none;

      li {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        padding-right: 0.5rem;
        padding-left: 0.5rem;

        .nav-link {
          height: 2rem;
          display: flex;
          justify-content: center;
          text-decoration: none;
          color: var(--c-text);
          border-bottom: 1px solid var(--c-lvl0);
          transition: all var(--hover-duration);

          .icon {
            color: var(--c-lvl5);

            .discord {
              width: 1rem;
              height: 1rem;
              background-color: var(--c-lvl5);
              mask: url("@/Assets/Icons/discord.svg") no-repeat center;
            }
          }

          .nav-link-container {
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

              .discord {
                background-color: var(--c-lvl0);
              }
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
</style>
