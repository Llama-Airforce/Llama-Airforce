<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const vbuterin = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const gramsci = "0x0b98718264cA14d0A17C145FfE1e4F3c38a39372";
const jared = "0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13";

const address = ref(vbuterin);

const blockie = `<Blockie
  size="small"
  :address />`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Blockie">
      <template #example>
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <div class="buttons">
            <Button
              class="primary"
              @click="address = vbuterin"
            >
              vbuterin.eth
            </Button>

            <Button
              class="primary"
              @click="address = gramsci"
            >
              gramsci.th
            </Button>

            <Button
              class="primary"
              @click="address = jared"
            >
              jaredfromsubway.eth
            </Button>
          </div>

          <InputText v-model="address" />

          <div class="blockies">
            <Blockie
              size="small"
              :address
            />

            <Blockie
              size="small"
              address=""
            />

            <Blockie
              size="medium"
              :address
            />

            <Blockie
              size="medium"
              address=""
            />

            <Blockie
              size="large"
              :address
            />

            <Blockie
              size="large"
              address=""
            />

            <Blockie
              size="huge"
              :address
            />

            <Blockie
              size="huge"
              address=""
            />
          </div>
        </div>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="blockie"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  .buttons {
    display: flex;
    gap: 1rem;

    button {
      flex-grow: 1;
    }
  }

  .blockies {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
}
</style>
