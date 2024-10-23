<script setup lang="ts" generic="T">
const modelValue = defineModel<string>({ required: true });

const {
  placeholder = "",
  options = [],
  search = false,
  filter = () => true,
  sort = null,
} = defineProps<{
  placeholder?: string;
  options?: T[];
  search?: boolean;
  filter?: (input: string, option: T) => boolean;
  sort?: (a: T, b: T) => number;
}>();

const emit = defineEmits<{
  input: [val: string];
  select: [option: T];
}>();

const showOptions = ref(false);

const optionsProcessed = computed<T[]>(() => {
  const optionsFiltered = [...options].filter((option) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    filter(modelValue.value, option)
  );

  const optionsSorted = sort ? optionsFiltered.sort(sort) : optionsFiltered;

  return optionsSorted;
});

function onInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value;

  modelValue.value = value;
  showOptions.value = !!value;

  emit("input", value);
}

function onSelect(option: T) {
  showOptions.value = false;

  emit("select", option);
}
</script>

<template>
  <div
    class="input-text"
    :class="{ search }"
  >
    <div class="input-form">
      <span
        v-if="search || $slots['icon']"
        class="icon"
      >
        <slot name="icon">
          <LucideSearch v-if="search" />
        </slot>
      </span>

      <input
        :type="search ? 'search' : 'text'"
        :value="modelValue"
        :placeholder
        @input.stop="onInput"
        @select.stop=""
      />
    </div>

    <!-- Auto-complete -->
    <div
      v-if="options && showOptions"
      class="items"
      :class="{ 'no-options': !(options && showOptions) }"
    >
      <div
        v-for="(option, i) of optionsProcessed"
        :key="i"
        class="item-wrapper"
        @click="onSelect(option)"
      >
        <slot
          name="item"
          :item="option"
          :idx="i"
        >
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-text {
  flex-grow: 1;

  position: relative;
  text-align: left;

  outline-color: transparent;
  line-height: 1.5rem;

  .input-form {
    display: flex;
  }

  input {
    all: unset;

    background-color: var(--c-lvl2);
    border: solid var(--border-thickness) var(--c-lvl4);
    border-radius: var(--border-radius);
    box-shadow: var(--input-box-shadow);

    transition: background-color 125ms ease;

    padding: 0rem 0.875rem;
    text-align: start;
    min-height: 2.5rem;
    width: calc(100% - 1rem - 4px); /* Minus padding and border twice. */
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
  }

  .items {
    color: var(--c-text);
    overflow: hidden;
    position: absolute;
    left: 0;
    z-index: 1;
    min-width: 100%;
    font-size: 1rem;

    background: var(--c-lvl1);
    box-shadow: var(--input-items-box-shadow);
    border-radius: var(--border-radius);

    > div {
      color: var(--c-text);
      cursor: pointer;

      /* Disable blue highlight because of pointer. */
      -webkit-tap-highlight-color: transparent;
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

  .no-options {
    display: none;
  }

  .icon {
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    left: 0.875rem;
    color: var(--c-lvl5);
  }

  &:has(.icon) input {
    padding-left: 2.875rem;
  }
}
</style>
