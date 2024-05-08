<template>
  <div class="root">
    <notifications
      :width="600"
      :duration="-1"
    />

    <VueQueryDevtools></VueQueryDevtools>

    <Navigation class="navigation"></Navigation>

    <main class="main">
      <div class="toolbar-container">
        <Breadcrumb
          v-if="storeBreadcrumb.show"
          class="breadcrumb"
          :crumbs="storeBreadcrumb.crumbs"
          @crumb="onCrumb"
        ></Breadcrumb>

        <div
          id="toolbar"
          class="toolbar-teleport"
        ></div>
      </div>

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
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { type Crumb } from "@/Framework/Crumb";
import Navigation from "@PM/Navigation/Navigation.vue";
import { useSettingsStore } from "@PM/Stores";

// Stores
const settingStore = useSettingsStore();
const storeBreadcrumb = useBreadcrumbStore();

// Refs
const route = useRoute();
const router = useRouter();

// Hooks
onMounted(() => {
  if (settingStore.flavor === "lrt") {
    window.document.documentElement.setAttribute("data-flavor", "lrt");
  }
});

// Watches
watch(
  () => route.fullPath,
  (newRoute) => {
    const noCrumbs = [
      "/pool",
      "/stable",
      "/redemptions",
      "/liquidation",
      "/profile",
      "/wrappers",
      "/proposals",
      "/veprisma",
    ];

    if (noCrumbs.some((x) => newRoute.startsWith(x))) {
      storeBreadcrumb.show = false;
    }
  }
);

// Methods
const onCrumb = async (crumb: Crumb) => {
  if (crumb.pathName) {
    await router.push({ name: crumb.pathName });
  }
};
</script>

<style lang="scss">
@import "@/Styles/Themes/PM/Light.scss";
@import "@/Styles/Themes/PM/Dark.scss";
@import "@/Styles/Variables.scss";
@import "@/Styles/Classes.scss";

[data-theme="light"] {
  @include themeLight();
}

[data-theme="dark"] {
  @include themeDark();
}

[data-theme="light"][data-flavor="lrt"] {
  @include themeLightLrt();
}

[data-theme="dark"][data-flavor="lrt"] {
  @include themeDarkLrt();
}

html {
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity $content-show-duration $ease-out;
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

  @media only screen and (max-width: 1280px) {
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
  }

  > .navigation {
    grid-row: 1;
    grid-column: 1;
  }

  > main {
    grid-row: 1;
    grid-column: 2;

    @media only screen and (max-width: 1280px) {
      grid-row: 2;
      grid-column: 1;
    }

    overflow-y: auto;

    @include toolbar;
  }
}
</style>
