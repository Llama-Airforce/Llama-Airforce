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
        <Button class="lvl2">
          <LucideTwitter />
        </Button>
      </a>

      <Button
        class="lvl2"
        @click="
          router.push('/code');
          emit('navigated');
        "
      >
        <LucideCode />
      </Button>
    </div>

    <SelectTheme
      direction="up"
      class="themes"
      :themes="['dark', 'light', 'chad']"
    />

    <Wallet class="lvl2" />
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

    --options-min-width: 210%;

    @media only screen and (max-width: 1280px) {
      --options-min-width: 100%;
    }
  }

  .wallet {
    grid-area: wallet;
  }
}
</style>
