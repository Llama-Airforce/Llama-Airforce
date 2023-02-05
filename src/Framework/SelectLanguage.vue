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
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Select } from "@/Framework";

const STORAGE_LOCALE = "locale";

type Direction = "up" | "down";

const locales = ["en", "zh"] as const;

type Locale = typeof locales[number];

const { t } = useI18n();
const { locale: loc } = useI18n({ useScope: "global" });

// Props
interface Props {
  direction?: Direction;
}

const { direction = "up" } = defineProps<Props>();

// Refs
let locale: Locale | null = $ref("en");
let selectLocaleOpen = $ref(false);

// Hooks
onMounted(() => {
  const locale = localStorage.getItem(STORAGE_LOCALE);
  if (locale && locales.some((l) => l === locale)) {
    onLocaleSelect(locale);
  }
});

// Events
const onLocaleOpen = (): void => {
  selectLocaleOpen = !selectLocaleOpen;
};

const onLocaleSelect = (option: unknown): void => {
  locale = option as Locale;
  loc.value = locale;

  localStorage.setItem(STORAGE_LOCALE, locale);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
::v-deep(.select) {
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
  ::v-deep(.select) {
    > .items {
      bottom: 120%; // Items will move upwards.
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
en: English
zh: 中文
</i18n>

<i18n lang="yaml" locale="zh">
en: English
zh: 中文
</i18n>
