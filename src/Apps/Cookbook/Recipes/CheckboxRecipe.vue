<template>
  <div class="checkboxes">
    <Recipe title="Basic Checkbox">
      <template #example>
        <Checkbox v-model="isChecked1"></Checkbox>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="checkboxBasic"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Checkbox with custom content">
      <template #example>
        <Checkbox v-model="isChecked2">
          <span style="color: var(--c-primary)">Custom styled content</span>
        </Checkbox>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="checkboxCustom"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Checkbox with icon">
      <template #example>
        <Checkbox v-model="isChecked3">
          <i
            class="fas fa-star"
            style="margin-right: 0.5rem"
          ></i>
          Star this repository
        </Checkbox>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="checkboxIcon"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Event - Change">
      <template #example>
        <Checkbox
          v-model="isChecked4"
          @change="onCheckboxChange"
        >
          Click me and check the console
        </Checkbox>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="checkboxEvent1"
        />

        <Code
          lang="typescript"
          :code="checkboxEvent2"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";
import Checkbox from "@/Framework/Checkbox.vue";
import { ref } from "vue";

const isChecked1 = ref(false);
const isChecked2 = ref(false);
const isChecked3 = ref(false);
const isChecked4 = ref(false);

const checkboxBasic = `<Checkbox v-model="isChecked1">Accept terms and conditions</Checkbox>`;

const checkboxCustom = `<Checkbox v-model="isChecked2">
  <span style="color: var(--c-primary)">Custom styled content</span>
</Checkbox>`;

const checkboxIcon = `<Checkbox v-model="isChecked3">
  <i class="fas fa-star" style="margin-right: 0.5rem;"></i>
  Star this repository
</Checkbox>`;

const checkboxEvent1 = `<Checkbox
  v-model="isChecked4"
  @change="onCheckboxChange"
>
  Click me and check the console
</Checkbox>`;

const checkboxEvent2 = `const onCheckboxChange = (checked: boolean) => {
  console.log('Checkbox state changed:', checked);
};`;

const onCheckboxChange = (checked: boolean) => {
  console.log("Checkbox state changed:", checked);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("checkboxes");

.checkboxes {
  row-gap: 3rem;
  grid-template-columns: 1fr 1fr;
}
</style>
