<template>
  <div class="root">
    <notifications
      :width="600"
      :duration="-1"
    />
    <Header class="header"></Header>
    <MenuDesktop class="menu"></MenuDesktop>

    <main class="main">
      <div class="content">
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
  </div>
</template>

<script setup lang="ts">
import Header from "@LAF/Navigation/Header.vue";
import MenuDesktop from "@LAF/Navigation/MenuDesktop.vue";
</script>

<style lang="scss">
@import "@/Styles/Themes/LAFDark.scss";
@import "@/Styles/Variables.scss";

:root {
  @include themeDark();
}

html {
  overflow-y: overlay;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background: lighten(rgb(20, 20, 20), 25%);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--c-primary);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--c-primary-hover);
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
</style>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.root {
  width: 1440px;

  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;

  > .header {
    grid-row: 1;
    grid-column: 1 / span 2;
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
        transition: opacity $content-show-duration $ease-out;
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
