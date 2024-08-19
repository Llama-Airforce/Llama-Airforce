<script setup lang="ts">
import ClearCacheButton from "@LAF/Pages/Debug/Components/ClearCacheButton.vue";
</script>

<template>
  <div class="debug">
    <div class="dashboard">
      <ClearCacheButton></ClearCacheButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("debug");

.debug {
  .dashboard {
    width: 25%;
  }
}
</style>
