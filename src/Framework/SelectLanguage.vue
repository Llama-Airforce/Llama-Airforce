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
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Select } from "@/Framework";

type Direction = "up" | "down";

const locales = ["en"] as const;

type Locale = typeof locales[number];

const { t, locale: loc } = useI18n();

// Props
interface Props {
  direction?: Direction;
}

const { direction = "up" } = defineProps<Props>();

// Refs
let locale: Locale | null = $ref("en");
let selectLocaleOpen = $ref(false);

// Events
const onLocaleOpen = (): void => {
  selectLocaleOpen = !selectLocaleOpen;
};

const onLocaleSelect = (option: unknown): void => {
  locale = option as Locale;
  loc.value = locale;
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
ja: Japanese
</i18n>
