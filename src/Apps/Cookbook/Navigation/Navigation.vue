<script setup lang="ts">
import Header from "./Header.vue";
import Bottom from "./Bottom.vue";
import { menu } from "./Menu";

const emit = defineEmits<{
  navigated: [];
}>();

const expanded = ref(false);

// Events
const onNavigated = () => {
  expanded.value = false;
  emit("navigated");
};
</script>

<template>
  <div
    class="menu-desktop"
    :class="{ expanded }"
  >
    <Header
      @toggle-expansion="expanded = !expanded"
      @navigated="onNavigated"
    ></Header>

    <Collapsible
      class="menu-content"
      :expanded
    >
      <Menu
        :menu
        @navigated="onNavigated"
      ></Menu>

      <Bottom @navigated="onNavigated"></Bottom>
    </Collapsible>
  </div>
</template>

<style scoped>
.menu-desktop {
  height: 100vh;
  height: 100dvh;

  display: grid;
  grid-template-columns: 18.125rem;
  grid-template-rows: 6.25rem 1fr auto;

  background: var(--c-lvl1);
  user-select: none;

  @media only screen and (max-width: 1280px) {
    width: 100vw;
    width: 100dvw;
    height: auto;
    grid-template-columns: 1fr;
    grid-template-rows: 4rem 1fr auto;

    &.expanded {
      height: 100vh;
      height: 100dvh;
    }
  }

  .menu-content {
    transition: grid-template-rows 125ms ease-out;

    @media not screen and (max-width: 1280px) {
      grid-template-rows: 1fr;
    }
  }
}
</style>
