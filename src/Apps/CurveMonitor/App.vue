<template>
  <div class="root">
    <notifications
      :width="600"
      :duration="-1"
    />

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

<script setup lang="ts"></script>

<style lang="scss">
@import "@/Styles/Themes/CMDark.scss";
@import "@/Styles/Themes/CMLight.scss";
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

[data-theme="light"] {
  @include themeLight();
}

[data-theme="dark"] {
  @include themeDark();
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
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;

  > main {
    grid-row: 1;
    grid-column: 1;

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
}
</style>
