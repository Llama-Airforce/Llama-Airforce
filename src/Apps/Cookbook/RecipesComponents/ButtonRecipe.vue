<script setup lang="ts">
import { mainnet } from "viem/chains";
import Recipe from "@CB/Recipe.vue";

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
  :chain-id="mainnet.id"
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

const showAlert = (msg: string) => {
  alert(msg);
};
</script>

<template>
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
          lang="html"
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
          lang="html"
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
          lang="html"
          :code="btnDisabled"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Web3">
      <template #example>
        <Button
          value="Value"
          :chain-id="mainnet.id"
        ></Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
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
          lang="html"
          :code="btnIcon"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Slot">
      <template #example>
        <Button>
          <div style="margin-right: 1rem">Content goes here</div>
          <i class="fas fa-plane"></i>
        </Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnSlot"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Event - Click">
      <template #example>
        <Button
          value="Click me!"
          @click="showAlert('You clicked me!')"
        ></Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnClick1"
        />

        <Code
          lang="typescript"
          :code="btnClick2"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Disabled">
      <template #example>
        <Button
          value="Disabled Button"
          disabled
        ></Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnDisabled"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
