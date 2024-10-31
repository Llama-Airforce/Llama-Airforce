<script setup lang="ts">
import Wallet from "@/Wallet/Wallet.vue";

const emit = defineEmits<{
  navigated: [];
}>();

const router = useRouter();

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
        <LucideLink />
      </Button>

      <a
        href="https://twitter.com/0xAlunara"
        target="_blank"
      >
        <Button class="lvl2">
          <LucideTwitter />
        </Button>
      </a>

      <a
        href="https://github.com/Llama-Airforce/Llama-Airforce"
        target="_blank"
      >
        <Button class="lvl2">
          <LucideGithub />
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
      style="grid-area: themes"
      direction="up"
      :themes="['dark', 'light', 'chad']"
    />

    <SelectLanguage
      style="grid-area: lang"
      direction="up"
      :locales="['en']"
    />

    <Wallet
      style="grid-area: wallet"
      class="lvl2"
    />
  </div>
</template>

<style scoped>
.bottom {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "buttons buttons buttons buttons"
    "themes themes lang lang"
    "wallet wallet wallet wallet";

  margin: 1.125rem;

  @media not screen and (max-width: 1280px) {
    display: flex;

    .select,
    .wallet {
      display: none;
    }
  }

  a {
    &:hover,
    &:active {
      background: initial;
    }
  }

  .buttons {
    grid-area: buttons;
    display: flex;
    gap: 1rem;
  }
}
</style>
