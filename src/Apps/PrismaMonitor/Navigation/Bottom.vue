<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";
import SelectTheme from "@PM/Navigation/SelectTheme.vue";

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

<style scoped>
.bottom {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    "themes buttons"
    "wallet wallet";

  margin: 1.125rem;

  .buttons {
    grid-area: buttons;
    display: flex;
    gap: 1rem;

    button {
      background: var(--c-lvl2);

      &:hover {
        background: var(--c-lvl2-hover);
      }

      &:active {
        background: var(--c-lvl2-active);
      }
    }

    a {
      &:hover,
      &:active {
        background: initial;
      }
    }
  }

  .themes {
    grid-area: themes;

    --select-items-min-width: 210%;

    @media only screen and (max-width: 1280px) {
      & {
        --select-items-min-width: 130%;
      }
    }
  }

  &:deep(.wallet) {
    grid-area: wallet;

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
