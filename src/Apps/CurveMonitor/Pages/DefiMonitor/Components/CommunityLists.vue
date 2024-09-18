<script setup lang="ts">
import CommunityList from "./CommunityList.vue";
</script>

<template>
  <div class="community-lists">
    <CommunityList></CommunityList>
    <CommunityList></CommunityList>
    <CommunityList></CommunityList>
  </div>
</template>

<style scoped>
.community-lists {
  display: grid;
  gap: calc(1.25 * var(--dashboard-gap));
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
