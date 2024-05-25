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

<script setup lang="ts">
const { t } = useI18n();

// Props
interface Props {
  extra?: string;
}

const { extra = "" } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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

  ::v-deep(.card-body) {
    a {
      align-self: center;
      cursor: pointer;
    }
  }
}
</style>

<i18n lang="yaml" src="@/locales/union.yml"></i18n>
