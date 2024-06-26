<template>
  <div class="buttons">
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

    <Recipe title="Slot">
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

    <Recipe title="Event - Click">
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

    <Recipe title="Web3">
      <template #example>
        <Button
          value="Switch to Ethereum"
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

    <Recipe title="Disabled">
      <template #example>
        <Button
          value="Disabled Button"
          disabled
        ></Button>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="btnDisabled"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";
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

const { network } = useWallet();
const currentNetwork = ref(network.value);

const showAlert = (msg: string) => {
  alert(msg);
  if (network.value !== currentNetwork.value) {
    currentNetwork.value = network.value;
    alert(`Network switched to: ${network.value}`);
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("buttons");

.buttons {
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
