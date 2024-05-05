<template>
  <div
    class="headers"
    :class="{ hasHeader }"
  >
    <HeaderDesktop class="desktop"></HeaderDesktop>
    <HeaderMobile class="mobile"></HeaderMobile>
  </div>
</template>

<script setup lang="ts">
import HeaderDesktop from "@LAF/Navigation/HeaderDesktop.vue";
import HeaderMobile from "@LAF/Navigation/HeaderMobile.vue";

const route = useRoute();

const hasHeader = computed((): boolean => {
  return route.name !== "curvemonitor";
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
