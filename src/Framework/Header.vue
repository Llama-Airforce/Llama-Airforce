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
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
import { HeaderDesktop, HeaderMobile } from "@/Framework";

const route = useRoute();

const hasHeader = $computed((): boolean => {
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
