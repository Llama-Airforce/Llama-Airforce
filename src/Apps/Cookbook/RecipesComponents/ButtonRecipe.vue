<script setup lang="ts">
import { mainnet } from "viem/chains";
import Recipe from "@CB/Recipe.vue";

const btnDefault = `<Button>
  Value
</Button>`;

const btnVariant1 = `<Button class="variant">
  Value
</Button>`;

const btnVariant2 = `.variant {
  --c-background: var(--c-primary);
  --c-states: var(--c-purple);
}`;

const btnVariantClass = `<Button class="primary">
  Value
</Button>`;

const btnDisabled = `<Button disabled>
  Value
</Button>`;

const btnWeb3 = `<Button :chain-id="mainnet.id">
  Value
</Button>`;

const btnIcon = `<Button>
  <LucidePlane /> Value
</Button>`;

const btnSlot = `<Button>
  <div style="margin-right: 1rem">
    Content goes here
  </div>
  <LucidePlane />
</Button>`;

const btnClick1 = `<Button @click="showAlert('You clicked me!')">
  Click me!
</Button>`;

const btnClick2 = `const showAlert = (msg: string) => alert(msg);`;

const showAlert = (msg: string) => {
  alert(msg);
};
</script>

<template>
  <div class="dashboard">
    <Recipe title="Default">
      <template #example>
        <Button>Value</Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnDefault"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Variant">
      <template #example>
        <Button class="variant">Value</Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnVariant1"
        ></Code>

        <Code
          lang="css"
          :code="btnVariant2"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Variant (class)">
      <template #example>
        <Button class="primary">Value</Button>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="btnVariantClass"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Disabled">
      <template #example>
        <Button disabled>Value</Button>
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
        <Button :chain-id="mainnet.id">Value</Button>
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
        <Button><LucidePlane /> Value</Button>
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
          <LucidePlane />
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
        <Button @click="showAlert('You clicked me!')">Click me!</Button>
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
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr 1fr;

  .variant {
    --c-background: var(--c-primary);
    --c-states: var(--c-purple);
  }
}
</style>
