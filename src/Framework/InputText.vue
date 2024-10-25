<script setup lang="ts" generic="T">
const modelValue = defineModel<string>({ required: true });

const {
  placeholder = "",
  options = [],
  search = false,
  filter = () => true,
  sort = null,
  direction = "down",
} = defineProps<{
  placeholder?: string;
  options?: T[];
  search?: boolean;
  filter?: (input: string, option: T) => boolean;
  sort?: (a: T, b: T) => number;
  direction?: "up" | "down";
}>();

const emit = defineEmits<{
  input: [val: string];
  select: [option: T];
}>();

const open = ref(false);

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
  open.value = !!value;

  emit("input", value);
}

function onSelect(option: T) {
  open.value = false;

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
        :class="[{ open }, direction]"
        :type="search ? 'search' : 'text'"
        :value="modelValue"
        :placeholder
        @input.stop="onInput"
        @select.stop=""
      />
    </div>

    <OptionsList
      v-if="optionsProcessed.length > 0"
      :direction
      :options="optionsProcessed"
      :open
      @select="onSelect"
    >
      <template #option="{ option, idx }">
        <slot
          name="option"
          :option
          :idx
        >
          {{ option }}
        </slot>
      </template>
    </OptionsList>
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
    align-items: center;
    height: 100%;
  }

  input {
    all: unset;

    height: 100%;
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

    &.open:not(&.up) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
    }
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
