<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const openModal = ref(false);

const onYes = () => {
  alert("You clicked yes!");
  openModal.value = false;
};

const modalYesNo1 = `<ModalYesNo
  title="Modal title"
  :show="openModal"
  @close="openModal = false"
  @no="openModal = false"
  @yes="onYes"
>
  <div class="content">Content goes here</div>
</ModalYesNo>`;

const modalYesNo2 = `const openModal = ref(false);

const onYes = () => {
  alert("You clicked yes!");
  openModal.value = false;
};`;

const modalYesNo3 = `.content
  width: 40rem;
}`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="ModalYesNo">
      <template #example>
        <Button @click="openModal = true">Open Modal</Button>

        <ModalYesNo
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
          lang="html"
          :code="modalYesNo1"
        />

        <Code
          lang="typescript"
          :code="modalYesNo2"
        />

        <Code
          lang="css"
          :code="modalYesNo3"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.content {
  width: 40rem;
}
</style>
