<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";
import SelectTheme from "@CM/Navigation/SelectTheme.vue";

const router = useRouter();
</script>

<template>
  <div class="bottom">
    <div class="buttons">
      <a
        href="https://twitter.com/0xAlunara"
        target="_blank"
      >
        <Button icon="fab fa-twitter"></Button>
      </a>

      <Button
        icon="fas fa-code"
        @click="router.push('/code')"
      ></Button>
    </div>

    <SelectTheme class="themes"></SelectTheme>

    <Wallet></Wallet>
  </div>
</template>

<style lang="scss" scoped>
.bottom {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "themes buttons"
    "wallet wallet";

  margin: 1.125rem;

  @mixin button-bg() {
    background: var(--c-lvl2);

    &:hover {
      background: var(--c-lvl2-hover);
    }

    &:active {
      background: var(--c-lvl2-active);
    }
  }

  .buttons {
    grid-area: buttons;
    display: flex;
    gap: 1rem;

    button {
      @include button-bg();
    }

    a {
      &:hover,
      &:active {
        background: initial;
      }
    }
  }

  :deep(.themes) {
    grid-area: themes;

    .label {
      font-size: 1rem;
      margin-left: 0.25rem;
    }

    .selected {
      .theme {
        .colors {
          display: none;
        }
      }
    }

    .items {
      width: 210%;

      @media only screen and (max-width: 1280px) {
        width: 130%;
      }
    }
  }

  > :deep(.wallet) {
    grid-area: wallet;

    .disconnect {
      @include button-bg();
    }
  }
}
</style>
