<template>
  <div class="debug">
    <div class="dashboard">
      <ClearCacheButton></ClearCacheButton>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import ClearCacheButton from "@/Pages/Debug/Components/ClearCacheButton.vue";
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.debug {
  width: 100%;

  display: flex;
  justify-content: center;

  .dashboard {
    width: 25%;
    padding: $page-margin;

    display: flex;
    flex-direction: column;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }
  }
}
</style>
