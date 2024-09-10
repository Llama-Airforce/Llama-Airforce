<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";
import SelectTheme from "@CB/Navigation/SelectTheme.vue";

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
        class="copy"
        icon="fas fa-link"
        @click="copyUrl"
      ></Button>

      <a
        href="https://twitter.com/0xAlunara"
        target="_blank"
      >
        <Button icon="fab fa-twitter"></Button>
      </a>

      <a
        href="https://github.com/Llama-Airforce/Llama-Airforce"
        target="_blank"
      >
        <Button icon="fab fa-github"></Button>
      </a>

      <router-link to="/code">
        <Button
          icon="fas fa-code"
          @click="emit('navigated')"
        ></Button>
      </router-link>
    </div>

    <div class="selectors">
      <SelectTheme class="themes"></SelectTheme>
      <SelectLanguage
        class="langs"
        :locales="['en']"
      ></SelectLanguage>
    </div>

    <Wallet></Wallet>
  </div>
</template>

<style lang="scss" scoped>
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

  > .buttons {
    button {
      background: var(--c-lvl2);

      &:hover {
        background: var(--c-lvl2-hover);
      }

      &:active {
        background: var(--c-lvl2-active);
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

  > :deep(.wallet) {
    .clear,
    .disconnect {
      background: var(--c-lvl2);

      &:hover {
        background: var(--c-lvl2-hover);
      }

      &:active {
        background: var(--c-lvl2-active);
      }
    }
  }
}
</style>
