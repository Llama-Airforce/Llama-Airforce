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
    </div>

    <Wallet></Wallet>
  </div>
</template>

<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";
import SelectTheme from "@PM/Navigation/SelectTheme.vue";

// Emits
const emit = defineEmits<{
  navigated: [];
}>();

// Methods
const copyUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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

  @mixin button-bg() {
    background: var(--c-lvl2);

    &:hover {
      background: var(--c-lvl2-hover);
    }

    &:active {
      background: var(--c-lvl2-active);
    }
  }

  > :deep(.buttons) {
    button {
      @include button-bg();
    }
  }

  > :deep(.selectors) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    .label {
      font-size: 1rem;
      margin-left: 0.25rem;
    }

    .chevrons {
      font-size: 0.5rem;
    }

    .themes {
      .selected {
        .theme {
          .colors {
            display: none;
          }
        }
      }

      .items {
        width: 100%;

        @media only screen and (max-width: 1280px) {
          width: 125%;
        }
      }
    }
  }

  > :deep(.wallet) {
    .clear,
    .disconnect {
      @include button-bg();
    }
  }
}
</style>
