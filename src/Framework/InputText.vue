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

<script setup lang="ts" generic="T">
// Model
const modelValue = defineModel<string>({ required: true });

// Props
interface Props {
  placeholder?: string;
  options?: T[];
  search?: boolean;
  autoComplete?: boolean;
  filter?: (input: string, option: T) => boolean;
  sort?: (a: T, b: T) => number;
}

const {
  placeholder = "",
  options = [],
  search = false,
  autoComplete = false,
  filter = () => () => true,
  sort = null,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  input: [val: string];
  select: [option: T];
}>();

// Refs
const optionsProcessed = computed((): T[] => {
  const optionsFiltered = options.filter((option) =>
    filter(modelValue.value, option)
  );
  const optionsSorted = sort
    ? [...optionsFiltered].sort(sort)
    : optionsFiltered;

  return optionsSorted;
});

// Events
const onInput = (evt: Event): void => {
  const value = (evt.target as HTMLInputElement).value;

  modelValue.value = value;
  emit("input", value);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.input-text {
  display: flex;
  flex-grow: 1;

  position: relative;
  text-align: left;
  outline-color: transparent;
  line-height: 1.5rem;

  > input {
    all: unset;

    background-color: var(--input-background);
    border: solid var(--border-thickness) var(--c-lvl4);
    border-radius: var(--border-radius);
    box-shadow: var(--input-box-shadow);

    transition: background-color 125ms ease;

    padding: 0rem 0.875rem;
    text-align: start;
    min-height: 2.5rem;
    width: calc(100% - 1rem - 4px); // minus padding and border twice.
    cursor: text;

    &::placeholder {
      color: var(--c-lvl5);
    }

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:hover,
    &:focus-visible {
      background-color: var(--input-background-hover);
      border-color: var(--input-border-color-hover);
    }

    &:active {
      background-color: var(--input-background-active);
      border-color: var(--input-border-color-active);
    }
  }

  > input[type="search"] {
    padding-left: 2.875rem;
  }

  > .items {
    color: var(--c-text);
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 10px;
    z-index: 15;
    line-height: 1.5rem;
    margin-top: calc(2.5rem - var(--border-radius) / 3);
    width: 100%;
    font-size: 1rem;

    background: var(--c-lvl1);
    box-shadow: var(--input-items-box-shadow);
    border-radius: var(--border-radius);

    > div {
      color: var(--c-text);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
      user-select: none;
      border-bottom: 1px solid var(--c-lvl3);
      padding: 0.5rem 0.75rem;

      &:hover {
        background-color: var(--c-primary);
      }
    }

    > div:last-child {
      border-bottom: 0;
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
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
    left: 0.875rem;
    font-size: 0.875rem;
    color: var(--c-lvl5);
  }
}
</style>
