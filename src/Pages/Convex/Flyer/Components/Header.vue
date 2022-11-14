<template>
  <div class="header">
    <img
      class="header-image"
      src="@/Assets/header.png"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
// Small hack because the current header is a placeholder for something real.
.header {
  width: 100%;
  margin-top: 1rem;

  .header-image {
    width: 100%;
  }
}
</style>
