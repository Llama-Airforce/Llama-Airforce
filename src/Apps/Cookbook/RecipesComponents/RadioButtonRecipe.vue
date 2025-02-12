<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const values = ["option1", "option2"] as const;
const selectedOption1 = ref("option1" as (typeof values)[number]);
const selectedOption2 = ref("option1" as (typeof values)[number]);
const selectedOption3 = ref("option1" as (typeof values)[number]);

const radioBasic = `<RadioButton
  v-model="selectedOption1"
  :values
  name="radio1"
  value="option1"
>
  Option 1
</RadioButton>

<RadioButton
  v-model="selectedOption1"
  :values
  name="radio1"
  value="option2"
>
  Option 2
</RadioButton>`;

const radioCustom = `<RadioButton
  v-model="selectedOption2"
  :values
  name="radio2"
  value="option1"
>
  <span style="color: var(--c-primary)">Custom styled content 1</span>
</RadioButton>

<RadioButton
  v-model="selectedOption2"
  :values
  name="radio2"
  value="option2"
>
  <span style="color: var(--c-secondary)">Custom styled content 2</span>
</RadioButton>`;

const radioEvent1 = `<RadioButton
  v-model="selectedOption3"
  :values
  name="radio3"
  value="option1"
  @change="onRadioChange"
>
  Option 1 (Click me and check the console)
</RadioButton>

<RadioButton
  v-model="selectedOption3"
  :values
  name="radio3"
  value="option2"
  @change="onRadioChange"
>
  Option 2 (Click me and check the console)
</RadioButton>`;

const radioEvent2 = `const onRadioChange = (value: (typeof values)[number]) => {
  console.log(\`Radio button state changed: $\{value}\`);
};`;

const onRadioChange = (value: (typeof values)[number]) => {
  console.log(`Radio button state changed: ${value}`);
};
</script>

<template>
  <div class="dashboard">
    <Recipe title="Basic Radio Button">
      <template #example>
        <RadioButton
          v-model="selectedOption1"
          name="radio1"
          value="option1"
          :values
        >
          Option 1
        </RadioButton>

        <RadioButton
          v-model="selectedOption1"
          name="radio1"
          value="option2"
          :values
        >
          Option 2
        </RadioButton>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="radioBasic"
        />
      </template>
    </Recipe>

    <Recipe title="Radio Button with custom content">
      <template #example>
        <RadioButton
          v-model="selectedOption2"
          name="radio2"
          value="option1"
          :values
        >
          <span style="color: var(--c-primary)">Custom styled content 1</span>
        </RadioButton>

        <RadioButton
          v-model="selectedOption2"
          name="radio2"
          value="option2"
          :values
        >
          <span style="color: var(--c-secondary)">Custom styled content 2</span>
        </RadioButton>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="radioCustom"
        />
      </template>
    </Recipe>

    <Recipe title="Event - Change">
      <template #example>
        <RadioButton
          v-model="selectedOption3"
          name="radio3"
          value="option1"
          :values
          @change="onRadioChange"
        >
          Option 1 (Click me and check the console)
        </RadioButton>

        <RadioButton
          v-model="selectedOption3"
          name="radio3"
          value="option2"
          :values
          @change="onRadioChange"
        >
          Option 2 (Click me and check the console)
        </RadioButton>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="radioEvent1"
        />

        <Code
          lang="typescript"
          :code="radioEvent2"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr;
}
</style>
