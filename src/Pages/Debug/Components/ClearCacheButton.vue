<template>
  <Button
    class="button"
    :primary="true"
    @click="onClearCache"
  >
    Clear Cache
  </Button>
</template>

<script
  setup
  lang="ts"
>
import Button from "@/Framework/Button.vue";

const onClearCache = (): void => {
  window.localStorage.removeItem("connectedWallet");
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.button {
  font-size: 1rem;
}
</style>
