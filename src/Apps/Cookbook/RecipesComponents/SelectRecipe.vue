<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";
import why from "@/Assets/Icons/why.png";

type SelectOption = {
  label: string;
  logo: string;
};

const options: SelectOption[] = [
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

const selected = ref<SelectOption>(options[0]);

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelect = (option: SelectOption): void => {
  selected.value = option;
};

const select1 = `<Select
  :options
  :selected
  @select="onSelect"
>
  <template #option="{ option }">
    <div class="option">
      <img :src="option.logo" />
      <div class="label">{{ option.label }}</div>
    </div>
  </template>
</Select>`;

const select2 = `type SelectOption = {
  label: string;
  logo: string;
};

const options: SelectOption[] = [
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

const selected = ref<SelectOption>(options[0]);

// Hooks
onMounted((): void => {
  onSelect(options[0]);
});

// Events
const onSelect = (option: SelectOption): void => {
  selected.value = option;
};`;

const select3 = `.select-component {
  width: 20rem;

  .option {
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
          :options
          :selected
          @select="onSelect"
        >
          <template #option="{ option }">
            <div class="option">
              <img :src="option.logo" />
              <div class="label">{{ option.label }}</div>
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
.select {
  width: 20rem;

  .option {
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
