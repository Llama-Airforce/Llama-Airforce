<script setup lang="ts">
import HeaderDesktop from "@LAF/Navigation/HeaderDesktop.vue";
import HeaderMobile from "@LAF/Navigation/HeaderMobile.vue";

const route = useRoute();

const hasHeader = computed(() => route.name !== "curvemonitor");
</script>

<template>
  <div
    class="headers"
    :class="{ hasHeader }"
  >
    <HeaderDesktop class="desktop" />
    <HeaderMobile class="mobile" />
  </div>
</template>

<style scoped>
.headers {
  display: none;

  &.hasHeader {
    display: flex;

    > .mobile {
      display: none;
    }

    @media only screen and (max-width: 1280px) {
      > .desktop {
        display: none;
      }

      > .mobile {
        display: flex;
      }
    }
  }
}
</style>
