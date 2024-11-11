<script setup lang="ts">
const emit = defineEmits<{
  navigated: [];
}>();

const router = useRouter();
</script>

<template>
  <div class="bottom">
    <a
      style="grid-area: twitter"
      href="https://twitter.com/0xAlunara"
      target="_blank"
    >
      <Button class="lvl2">
        <LucideTwitter />
      </Button>
    </a>

    <Button
      style="grid-area: code"
      class="lvl2"
      @click="
        router.push('/code');
        emit('navigated');
      "
    >
      <LucideCode />
    </Button>

    <SelectTheme
      style="grid-area: themes"
      direction="up"
      class="themes"
      :themes="['dark', 'light', 'chad']"
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
  grid-template-columns: 1fr auto auto;
  grid-template-areas:
    "themes twitter code"
    "wallet wallet wallet";

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
}
</style>
