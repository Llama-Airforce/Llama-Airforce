<template>
  <div class="headers">
    <HeaderDesktop class="desktop"></HeaderDesktop>
    <HeaderMobile class="mobile"></HeaderMobile>
  </div>
</template>

<script
  setup
  lang="ts"
>
import HeaderDesktop from "@/Framework/HeaderDesktop.vue";
import HeaderMobile from "@/Framework/HeaderMobile.vue";
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.headers {
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
</style>
