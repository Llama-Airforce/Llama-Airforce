<script setup lang="ts">
const { t } = useI18n();

const { extra = "" } = defineProps<{
  extra?: string;
}>();
</script>

<template>
  <Card>
    <div class="docs">
      <div class="icon">
        <i class="fas fa-book"></i>
      </div>

      <h1>
        <span
          v-if="extra"
          style="margin-right: 0.75rem"
        >
          {{ extra }}
        </span>

        <span v-html="t('docs')"></span>
      </h1>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.docs {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;

  > .icon {
    grid-column: 1;
    display: flex;
    align-items: center;

    i {
      color: var(--c-primary);
    }
  }

  h1 {
    grid-column: 2;
    font-size: 1rem;
    color: var(--c-text);
  }
}
</style>

<i18n lang="yaml" locale="en">
docs: Read our docs <a href="https://docs.llama.airforce" target="_blank">here</a>.
</i18n>

<i18n lang="yaml" locale="zh">
docs: 阅读我们的文件<a href="https://docs.llama.airforce" target="_blank">这里</a>.
</i18n>

<i18n lang="yaml" locale="fr">
docs: Lisez notre documentation <a href="https://docs.llama.airforce" target="_blank">ici</a>.
</i18n>
