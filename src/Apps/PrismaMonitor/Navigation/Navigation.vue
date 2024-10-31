<script setup lang="ts">
import Top from "./Header.vue";
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
    class="menu"
    :class="{ expanded }"
  >
    <Top
      @toggle-expansion="expanded = !expanded"
      @navigated="onNavigated"
    />

    <Collapsible
      class="menu-content"
      :expanded
    >
      <Menu
        :menu
        @navigated="onNavigated"
      />

      <Bottom @navigated="onNavigated" />
    </Collapsible>
  </div>
</template>

<style scoped>
.menu {
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
