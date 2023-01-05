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
import { Header, MenuDesktop } from "@/Framework";
</script>

<style lang="scss">
@import "@/Styles/Variables.scss";

@font-face {
  font-family: "SF Mono";
  font-style: normal;
  font-weight: 300;
  src: url("/SF-Mono-Light.otf") format("opentype");
}

@font-face {
  font-family: "SF Mono";
  font-style: normal;
  font-weight: 500;
  src: url("/SF-Mono-Medium.otf") format("opentype");
}

@font-face {
  font-family: "SF Mono";
  font-style: normal;
  font-weight: normal;
  src: url("/SF-Mono-Regular.otf") format("opentype");
}

@font-face {
  font-family: "SF Mono";
  font-style: normal;
  font-weight: bold;
  src: url("/SF-Mono-Bold.otf") format("opentype");
}

html {
  font-family: SF Mono, Consolas, monospace;
  font-size: 16px;

  @media only screen and (max-width: 1280px) {
    font-size: 12px;
  }

  overflow-y: overlay;

  ::-webkit-scrollbar {
    width: 0.25rem;
  }

  ::-webkit-scrollbar-track {
    background: lighten(rgb(20, 20, 20), 25%);
  }

  ::-webkit-scrollbar-thumb {
    background: $blue;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: lighten($blue, 6%);
  }
}

body {
  margin: 0;

  background-color: $background-color;
  color: $text;
}

a {
  color: $blue;
  text-decoration: none;

  &:hover {
    color: #18181b;
    background: #aea8af;
  }

  &:active {
    color: #18181b;
    background: #aea8af;
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
