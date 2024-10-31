<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

const { crumbs, show } = storeToRefs(useBreadcrumbStore());
const { onCrumb } = useBreadcrumbStore();
</script>

<template>
  <div class="root">
    <notifications
      :width="600"
      :duration="-1"
    />

    <VueQueryDevtools />

    <slot name="navigation"></slot>

    <main>
      <Breadcrumb
        v-if="show"
        class="breadcrumb"
        :crumbs
        @crumb="onCrumb"
      />

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

<style>
html {
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
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
  overflow-y: overlay;
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

p {
  display: flex;
  margin-block-start: 0rem;
  margin-block-end: 1rem;
}

#app {
  display: flex;
  justify-content: center;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--hover-duration) cubic-bezier(0.4, 0, 1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.root {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow-y: hidden;

  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas: "navigation main";

  @media only screen and (max-width: 1280px) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }

  > main {
    grid-area: main;
    overflow-y: auto;

    @media only screen and (max-width: 1280px) {
      grid-row: 2;
      grid-column: 1;
    }

    > .breadcrumb {
      margin: var(--page-margin);
      margin-bottom: calc(-1 * var(--page-margin) + var(--dashboard-gap));

      @media only screen and (max-width: 1280px) {
        margin: 1.5rem 1rem;
        margin-bottom: 0px;
        display: flex;
      }
    }
  }
}
</style>
