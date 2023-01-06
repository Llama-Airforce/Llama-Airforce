<template>
  <div class="input-text">
    <span
      v-if="search"
      class="icon"
    >
      <i class="fas fa-search"></i>
    </span>

    <input
      :type="search ? 'search' : 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      @input.stop="onInput"
      @select.stop=""
    />

    <!-- Auto-complete -->
    <div
      v-if="options && autoComplete"
      class="items"
      :class="{ selectHide: !autoComplete }"
    >
      <div
        v-for="(option, i) of optionsProcessed"
        :key="i"
        @click="emit('select', option)"
      >
        <slot
          name="item"
          :item="(option as never)"
          :idx="i"
        >
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";

// Props
interface Props {
  modelValue: string;
  placeholder?: string;
  options?: unknown[];
  search?: boolean;
  autoComplete?: boolean;
  filter?: (input: string, option: unknown) => boolean;
  sort?: (a: unknown, b: unknown) => number;
}

const {
  modelValue,
  placeholder = "",
  options = [],
  search = false,
  autoComplete = false,
  filter = () => () => true,
  sort = null,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", val: string): void;
  (e: "input", val: string): void;
  (e: "select", option: unknown): void;
}>();

// Refs
const optionsProcessed = $computed((): unknown[] => {
  const optionsFiltered = options.filter((option) =>
    filter(modelValue, option)
  );
  const optionsSorted = sort
    ? [...optionsFiltered].sort(sort)
    : optionsFiltered;

  return optionsSorted;
});

// Events
const onInput = (evt: Event): void => {
  const value = (evt.target as HTMLInputElement).value;

  emit("update:modelValue", value);
  emit("input", value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.input-text {
  display: flex;
  flex-grow: 1;

  > input {
    all: unset;
    background-color: $datatable-background;
    border: solid 2px $level4-color;
    padding: 0.1rem 0.5rem;
    text-align: start;
    height: 2rem;
    width: calc(100% - 1rem - 4px); // minus padding and border twice.
    cursor: text;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:hover {
      background-color: $datatable-background-hover;
      border-color: lighten($level4-color, 6%);
    }

    &:active {
      background-color: $datatable-background-active;
      border-color: lighten($level4-color, 12%);
    }
  }

  > input[type="search"] {
    padding-left: 2.75em;
  }

  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  line-height: 1.5rem;

  > .items {
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 12;
    line-height: 1.75rem;
    margin-top: 2.75rem;
    width: 100%;

    background: linear-gradient(0deg, $level1-color, $level1-color),
      $background-color;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

    > div {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
      user-select: none;
      border-bottom: 1px solid $level4-color;
      padding: 0.5rem 0.75rem;
      cursor: pointer;

      &:hover {
        background-color: $blue;
      }
    }

    > div:last-child {
      border-bottom: 0;
    }
  }

  .selectHide {
    display: none;
  }

  .icon {
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    left: 0.75em;
  }
}
</style>
