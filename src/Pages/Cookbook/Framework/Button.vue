<template>
  <div class="button">
    <div class="dashboard">
      <div class="item">
        <Button
          value="Value"
          :primary="true"
        ></Button>

        <div class="info">Primary</div>

        <Code
          lang="xml"
          :code="btnPrimary"
        />
      </div>

      <div class="item">
        <Button
          value="Value"
          :primary="false"
        ></Button>

        <div class="info">Not Primary</div>

        <Code
          lang="xml"
          :code="btnPrimaryNon"
        />
      </div>

      <div class="item">
        <Button
          value="Value"
          :disabled="true"
        ></Button>

        <div class="info">Disabled</div>

        <Code
          lang="xml"
          :code="btnDisabled"
        />
      </div>

      <div class="item">
        <Button
          value="Value"
          :web3="true"
        ></Button>

        <div class="info">Web3</div>

        <Code
          lang="xml"
          :code="btnWeb3"
        />
      </div>

      <div class="item">
        <Button
          value="Value"
          icon="fas fa-plane"
        ></Button>

        <div class="info">Icon</div>

        <Code
          lang="xml"
          :code="btnIcon"
        />
      </div>

      <div
        class="item"
        style="grid-column: 2 / span 3"
      >
        <Button>
          <div style="margin-right: 1rem">Content goes here</div>
          <i class="fas fa-plane"></i>
        </Button>

        <div class="info">Slot</div>

        <Code
          lang="xml"
          :code="btnSlot"
        />
      </div>

      <div
        class="item"
        style="grid-column: 1 / span 4"
      >
        <Button
          value="Click me!"
          @click="showAlert('You clicked me!')"
        ></Button>

        <div class="info">Event - Click</div>

        <Code
          lang="xml"
          :code="btnClick1"
        />

        <Code
          lang="typescript"
          :code="btnClick2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/Framework/Button.vue";
import Code from "@/Framework/Code.vue";

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
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("button");

.button {
  .dashboard {
    row-gap: 3rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    @include cookbook-item;
  }
}
</style>
