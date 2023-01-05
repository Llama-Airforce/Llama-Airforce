<template>
  <div class="button-toggle">
    <div class="dashboard">
      <div class="item">
        <ButtonToggle
          v-model="toggle"
          value="Value"
          icon="fas fa-plane"
        ></ButtonToggle>

        <Code
          lang="xml"
          :code="btnToggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { ButtonToggle, Code } from "@/Framework";

const toggle = $ref(false);

const btnToggle = `<ButtonToggle
  v-model="toggle"
  value="Value"
  icon="fas fa-plane"
></ButtonToggle>`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("button-toggle");

.button-toggle {
  .dashboard {
    @include cookbook-item;
  }
}
</style>
