<template>
  <div class="modal">
    <div class="dashboard">
      <Recipe title="ModalYesNo">
        <template #example>
          <Button @click="openModal = true">Open Modal</Button>

          <ModalYesNo
            class="my-modal"
            title="Modal title"
            :show="openModal"
            @close="openModal = false"
            @no="openModal = false"
            @yes="onYes"
          >
            <div class="content">Content goes here</div>
          </ModalYesNo>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="modalYesNo1"
          ></Code>

          <Code
            lang="typescript"
            :code="modalYesNo2"
          ></Code>

          <Code
            lang="scss"
            :code="modalYesNo3"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button, ModalYesNo, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const openModal = ref(false);

const onYes = () => {
  alert("You clicked yes!");
  openModal.value = false;
};

const modalYesNo1 = `<ModalYesNo
  class="my-modal"
  title="Modal title"
  :show="openModal"
  @close="openModal = false"
  @no="openModal = false"
  @yes="onYes"
>
  <div class="content">Content goes here</div>
</ModalYesNo>`;

const modalYesNo2 = `import { ref } from "vue";

const openModal = ref(false);

const onYes = () => {
  alert("You clicked yes!");
  openModal.value = false;
};`;

const modalYesNo3 = `.my-modal {
  ::v-deep(.content) {
    width: 40rem;
  }
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("modal");

.my-modal {
  ::v-deep(.content) {
    width: 40rem;
  }
}
</style>
