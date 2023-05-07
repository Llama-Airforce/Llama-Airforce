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
      :expanded="expanded"
    >
      <Menu @navigated="onNavigated"></Menu>
      <Bottom @navigated="onNavigated"></Bottom>
    </Collapsible>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Collapsible } from "@/Framework";
import Header from "@CM/Navigation/Header.vue";
import Menu from "@CM/Navigation/Menu.vue";
import Bottom from "@CM/Navigation/Bottom.vue";

// Emits
const emit = defineEmits<{
  (e: "navigated"): void;
}>();

// Refs
const expanded = ref(false);

// Events
const onNavigated = () => {
  expanded.value = false;
  emit("navigated");
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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

    ::v-deep(.collapsible-inside) {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }
}
</style>
