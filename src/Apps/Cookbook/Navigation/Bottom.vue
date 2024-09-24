<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";

const emit = defineEmits<{
  navigated: [];
}>();

// Methods
const copyUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);
};
</script>

<template>
  <div class="bottom">
    <div class="buttons">
      <Button
        class="copy lvl2"
        @click="copyUrl"
      >
        <i class="fas fa-link"></i>
      </Button>

      <a
        href="https://twitter.com/0xAlunara"
        target="_blank"
      >
        <Button class="lvl2">
          <i class="fab fa-twitter"></i>
        </Button>
      </a>

      <a
        href="https://github.com/Llama-Airforce/Llama-Airforce"
        target="_blank"
      >
        <Button class="lvl2">
          <i class="fab fa-github"></i>
        </Button>
      </a>

      <router-link to="/code">
        <Button
          class="lvl2"
          @click="emit('navigated')"
        >
          <i class="fas fa-code"></i>
        </Button>
      </router-link>
    </div>

    <div class="selectors">
      <SelectTheme
        class="themes"
        :themes="['dark', 'light', 'chad']"
      ></SelectTheme>

      <SelectLanguage
        class="langs"
        :locales="['en']"
      ></SelectLanguage>
    </div>

    <Wallet class="lvl2"></Wallet>
  </div>
</template>

<style scoped>
.bottom {
  display: flex;
  flex-direction: column;

  gap: 1rem;
  margin: 1.125rem;

  .buttons {
    display: flex;
    gap: 1.25rem;

    a {
      &:hover,
      &:active {
        background: initial;
      }
    }
  }

  > .selectors {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;

    .themes {
      --select-items-min-width: 220%;

      @media only screen and (max-width: 1280px) {
        --select-items-min-width: 125%;
      }
    }
  }
}
</style>
