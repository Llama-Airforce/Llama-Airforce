<script setup lang="ts">
import Logo from "./Logo.vue";

const emit = defineEmits<{
  "toggle-expansion": [];
  navigated: [];
}>();
</script>

<template>
  <div class="top">
    <router-link
      class="logo"
      to="/"
      @click="emit('navigated')"
    >
      <Logo class="logo" />
    </router-link>

    <div class="buttons">
      <Button
        class="lvl1"
        @click="emit('toggle-expansion')"
      >
        <LucideMenu />
      </Button>
    </div>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 1280px) {
  .top > .logo {
    transform: scale(0.75);
  }
}

.top {
  @media only screen and (max-width: 1280px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .buttons {
      margin-right: 1.75rem;
      display: flex !important;
    }
  }

  > .buttons {
    display: none;
  }

  > .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    cursor: pointer;
    color: var(--c-text);

    &:hover {
      background: unset;
    }
  }
}
</style>
