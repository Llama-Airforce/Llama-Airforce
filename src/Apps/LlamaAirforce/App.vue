<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import type { Theme } from "@/Styles/Theme";
import { colors } from "@/Styles/ChartTheme";
import Header from "@LAF/Navigation/Header.vue";
import Footer from "@LAF/Navigation/Footer.vue";
import MenuDesktop from "@LAF/Navigation/MenuDesktop.vue";
import Announcement from "@LAF/Components/Announcement.vue";

import "@/Styles/Themes/LAF/Dark.css";

// Theme
window.document.documentElement.setAttribute("data-theme", "dark");

const theme = computed<Theme>(() => ({
  colors: colors.value,
  colorsArray: [
    colors.value.blue,
    colors.value.yellow,
    colors.value.green,
    colors.value.red,
    colors.value.purple,
  ],
}));

provideTheme(theme);
</script>

<template>
  <div class="root">
    <notifications
      :width="600"
      :duration="-1"
    />

    <VueQueryDevtools />

    <Header class="header" />
    <MenuDesktop class="menu" />

    <main class="main">
      <div class="content">
        <Announcement />

        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <Footer class="footer" />
  </div>
</template>

<style>
html {
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background: #545454;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--c-primary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: hsl(
      from var(--c-primary) h s calc(l + 6 * var(--color-scheme-dark))
    );
  }
}

body {
  margin: 0;

  background-color: var(--c-lvl0);
  color: var(--c-text);
}

a {
  color: var(--c-primary);
  text-decoration: none;

  &:hover {
    color: var(--c-lvl0);
    background: var(--c-lvl6);
  }

  &:active {
    color: var(--c-lvl0);
    background: var(--c-lvl6);
  }
}

#app {
  display: flex;
  justify-content: center;
}

.kpi {
  padding: 0.5rem 0.75rem !important;
}
</style>

<style scoped>
.root {
  width: 1440px;

  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto 1fr;

  > .header {
    grid-row: 1;
    grid-column: 1 / span 2;
  }

  > .footer {
    grid-row: 3;
    grid-column: 2;

    @media only screen and (max-width: 1280px) {
      display: flex;

      grid-row: 3;
      grid-column: 1 / span 2;

      justify-self: center;
    }
  }

  > .menu {
    grid-row: 2 / span 2;
    grid-column: 1;
  }

  > main {
    grid-row: 2;
    grid-column: 2;

    > .content {
      .fade-enter-active,
      .fade-leave-active {
        transition: opacity var(--hover-duration) cubic-bezier(0.4, 0, 1, 1);
      }

      .fade-enter-from,
      .fade-leave-to {
        opacity: 0;
      }
    }
  }

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;

    > .menu {
      display: none;
    }
  }
}
</style>
