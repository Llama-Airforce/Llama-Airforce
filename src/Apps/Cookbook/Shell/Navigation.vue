<script setup lang="ts">
import Navigation from "@/Framework/Monitor/Shell/Navigation.vue";
import Top from "./Top.vue";
import Bottom from "./Bottom.vue";
import { menu } from "./Menu";

const emit = defineEmits<{
  navigated: [];
}>();

const expanded = ref(false);

const onNavigated = () => {
  expanded.value = false;
  emit("navigated");
};
</script>

<template>
  <Navigation :expanded>
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
  </Navigation>
</template>

<style scoped>
.menu-content {
  transition: grid-template-rows 125ms ease-out;

  @media not screen and (max-width: 1280px) {
    grid-template-rows: 1fr;
  }
}
</style>
