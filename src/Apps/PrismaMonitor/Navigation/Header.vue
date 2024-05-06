<template>
  <div class="header">
    <router-link
      class="logo"
      to="/"
      @click="emit('navigated')"
    >
      <Logo class="logo"></Logo>
    </router-link>

    <div class="buttons">
      <Button
        icon="fas fa-bars"
        @click="emit('toggle-expansion')"
      ></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from "@PM/Navigation/Logo.vue";

// Emits
const emit = defineEmits<{
  "toggle-expansion": [];
  navigated: [];
}>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@media only screen and (max-width: 1280px) {
  .header > .logo {
    transform: scale(0.75);
  }
}

.header {
  @media only screen and (max-width: 1280px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > .buttons {
      margin-right: 1.75rem;
      display: flex !important;

      @mixin button-bg() {
        background: var(--c-lvl1);

        &:hover {
          background: var(--c-lvl1-hover);
        }

        &:active {
          background: var(--c-lvl1-active);
        }
      }

      button {
        @include button-bg();
      }
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
