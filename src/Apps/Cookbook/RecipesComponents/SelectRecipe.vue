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

const selected = ref<SelectItem>(options[0]);

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelect = (option: SelectItem): void => {
  selected.value = option;
};

const select1 = `<Select
  class="select-component"
  :options
  :selected
  @input="onSelect"
>
  <template #item="{ item }">
    <div class="item">
      <img :src="item.logo" />
      <div class="label">{{ item.label }}</div>
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

const selected = ref<SelectItem>(options[0]);

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelect = (option: SelectItem): void => {
  selected.value = option;
};`;

const select3 = `.select-component {
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

<template>
  <div class="dashboard">
    <Recipe title="Select">
      <template #example>
        <Select
          class="select-component"
          :options
          :selected
          @input="onSelect"
        >
          <template #item="{ item }">
            <div class="item">
              <img :src="item.logo" />
              <div class="label">{{ item.label }}</div>
            </div>
          </template>
        </Select>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="select1"
        />

        <Code
          lang="typescript"
          :code="select2"
        />

        <Code
          lang="css"
          :code="select3"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.select-component {
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
