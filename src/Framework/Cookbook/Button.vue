<template>
  <div class="button">
    <div class="dashboard">
      <Recipe title="Primary">
        <template #example>
          <Button
            value="Value"
            :primary="true"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnPrimary"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Not Primary">
        <template #example>
          <Button
            value="Value"
            :primary="false"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnPrimaryNon"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Disabled">
        <template #example>
          <Button
            value="Value"
            :disabled="true"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnDisabled"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Web3">
        <template #example>
          <Button
            value="Value"
            :web3="true"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnWeb3"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="Icon">
        <template #example>
          <Button
            value="Value"
            icon="fas fa-plane"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnIcon"
          ></Code>
        </template>
      </Recipe>

      <Recipe
        title="Slot"
        style="grid-column: 2 / span 3"
      >
        <template #example>
          <Button>
            <div style="margin-right: 1rem">Content goes here</div>
            <i class="fas fa-plane"></i>
          </Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnSlot"
          ></Code>
        </template>
      </Recipe>

      <Recipe
        title="Event - Click"
        style="grid-column: 1 / span 4"
      >
        <template #example>
          <Button
            value="Click me!"
            @click="showAlert('You clicked me!')"
          ></Button>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="btnClick1"
          />

          <Code
            lang="typescript"
            :code="btnClick2"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const btnPrimary = `<Button
  value="Value"
  :primary="true"
></Button>`;

const btnPrimaryNon = `<Button
  value="Value"
  :primary="false"
></Button>`;

const btnDisabled = `<Button
  value="Value"
  :disabled="true"
></Button>`;

const btnWeb3 = `<Button
  value="Value"
  :web3="true"
></Button>`;

const btnIcon = `<Button
  value="Value"
  icon="fas fa-plane"
></Button>`;

const btnSlot = `<Button>
  <div style="margin-right: 1rem">Content goes here</div>
  <i class="fas fa-plane"></i>
</Button>`;

const btnClick1 = `<Button
  value="Click me!"
  @click="showAlert('You clicked me!')"
></Button>`;

const btnClick2 = `const showAlert = (msg: string) => alert(msg);`;

const showAlert = (msg: string) => alert(msg);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("button");

.button {
  .dashboard {
    row-gap: 3rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}
</style>
