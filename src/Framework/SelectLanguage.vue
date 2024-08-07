<template>
  <Select
    class="select"
    :class="{ 'direction-up': direction === 'up' }"
    :options="locales.map((x) => x)"
    :selected="locale"
    :open="selectLocaleOpen"
    @open="onLocaleOpen"
    @close="selectLocaleOpen = false"
    @input="onLocaleSelect"
  >
    <template #item="props: { item: Locale }">
      <div class="item">
        <div class="label">{{ t(props.item) }}</div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { locales as localesAll, type Locale } from "@/Framework/Locale";

const STORAGE_LOCALE = "locale";

type Direction = "up" | "down";

const { t } = useI18n();
const locale = useStorage<Locale>(STORAGE_LOCALE, "en");
const { locale: loc } = useI18n({ useScope: "global" });

// Props
interface Props {
  locales?: Locale[];
  direction?: Direction;
}

const { locales = localesAll, direction = "up" } = defineProps<Props>();

// Hooks
onMounted(() => {
  onLocaleSelect(locale.value);
});

// Select
const selectLocaleOpen = ref(false);

const onLocaleOpen = (): void => {
  selectLocaleOpen.value = !selectLocaleOpen.value;
};

const onLocaleSelect = (option: Locale): void => {
  locale.value = option;
  loc.value = locale.value;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

:deep(.select) {
  .item {
    display: flex;
    align-items: center;

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}

.direction-up {
  :deep(.select) {
    > .items {
      bottom: 120%; // Items will move upwards.
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
en: English
zh: 中文
fr: Français
</i18n>
