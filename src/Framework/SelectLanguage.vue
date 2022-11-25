<template>
  <div
    class="selector"
    :class="{ 'direction-up': direction === 'up' }"
    tabindex="0"
    @click.stop="onLocaleOpen"
    @blur="selectLocaleOpen = false"
  >
    <Select
      class="select"
      :options="locales.map((x) => x)"
      :selected="locale"
      :open="selectLocaleOpen"
      @input="onLocaleSelect"
    >
      <template #item="props: { item: Locale }">
        <div class="item">
          <div class="label">{{ t(props.item) }}</div>
        </div>
      </template>
    </Select>

    <div class="chevron">
      <i class="fas fa-chevron-up"></i>
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import Select from "@/Framework/Select.vue";

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
.selector {
  position: relative;
  display: flex;

  > .chevron {
    position: absolute;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    top: 0.5rem;
    right: 1rem;
  }

  ::v-deep(.select) {
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
    transition: background $hover-duration;

    background: lighten($background-color-widget, 6%);
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

    line-height: 1.75rem;

    &:hover {
      background: lighten($background-color-widget, 12%);
    }

    > .selected {
      font-size: 1rem;
      padding: 0.4rem 0.75rem;
    }

    > .items {
      margin-top: 0.5rem;
      right: 10px;
      left: 0;
      line-height: 1.75rem;
      font-size: 1rem;
      width: 100%;

      > div {
        padding: 0.4rem 0.75rem;
      }
    }

    .item {
      display: flex;
      align-items: center;

      > .label {
        font-size: 0.875rem;
        margin-left: 0.75rem;
      }
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
