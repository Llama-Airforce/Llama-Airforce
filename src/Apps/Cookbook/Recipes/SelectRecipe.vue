<template>
  <div class="selects">
    <Recipe title="Select">
      <template #example>
        <Select
          class="select-component"
          :options="options"
          :selected="selected"
          :open="selectOpen"
          @open="onSelectOpen"
          @close="selectOpen = false"
          @input="onSelect"
        >
          <template #item="props: { item: SelectItem }">
            <div
              v-if="props.item"
              class="item"
            >
              <img :src="props.item.logo" />
              <div class="label">{{ props.item.label }}</div>
            </div>
          </template>
        </Select>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="select1"
        ></Code>

        <Code
          lang="typescript"
          :code="select2"
        ></Code>

        <Code
          lang="scss"
          :code="select3"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";
import why from "@/Assets/Icons/why.png";

type SelectItem = {
  label: string;
  logo: string;
};

const options: SelectItem[] = [
  {
    label: "Option 1",
    logo: why,
  },
  {
    label: "Option 2",
    logo: why,
  },
  {
    label: "Option 3",
    logo: why,
  },
];

const selectOpen = ref(false);
const selected = ref<SelectItem | null>(null);

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelectOpen = (): void => {
  selectOpen.value = !selectOpen.value;
};

const onSelect = (option: SelectItem): void => {
  selected.value = option;
};

const select1 = `<Select
  class="select-component"
  :options="options"
  :selected="selected"
  :open="selectOpen"
  @open="onSelectOpen"
  @close="selectOpen = false"
  @input="onSelect"
>
  <template #item="props: { item: SelectItem }">
    <div
      v-if="props.item"
      class="item"
    >
      <img :src="props.item.logo" />
      <div class="label">{{ props.item.label }}</div>
    </div>
  </template>
</Select>`;

const select2 = `type SelectItem = {
  label: string;
  logo: string;
};

const options: SelectItem[] = [
  {
    label: "Option 1",
    logo: why,
  },
  {
    label: "Option 2",
    logo: why,
  },
  {
    label: "Option 3",
    logo: why,
  },
];

const selectOpen = ref(false);
const selected = ref<SelectItem | null>;

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelectOpen = (): void => {
  selectOpen.value = !selectOpen.value;
};

const onSelect = (option: SelectItem): void => {
  selected.value = option;
};`;

const select3 = `::v-deep(.select-component) {
  width: 20rem;

  .item {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("selects");

::v-deep(.select-component) {
  width: 20rem;

  .item {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}
</style>
