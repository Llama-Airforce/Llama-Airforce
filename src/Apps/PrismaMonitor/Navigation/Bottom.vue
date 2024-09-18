<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";

const emit = defineEmits<{
  navigated: [];
}>();

const router = useRouter();
</script>

<template>
  <div class="bottom">
    <div class="buttons">
      <a
        href="https://twitter.com/0xAlunara"
        target="_blank"
      >
        <Button
          class="lvl2"
          icon="fab fa-twitter"
        ></Button>
      </a>

      <Button
        class="lvl2"
        icon="fas fa-code"
        @click="
          router.push('/code');
          emit('navigated');
        "
      ></Button>
    </div>

    <SelectTheme
      class="themes"
      :themes="['dark', 'light']"
    ></SelectTheme>

    <Wallet class="lvl2"></Wallet>
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
      --select-items-min-width: 130%;
    }
  }

  .wallet {
    grid-area: wallet;
  }
}
</style>
