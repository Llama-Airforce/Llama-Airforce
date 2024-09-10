<script setup lang="ts">
const {
  show = false,
  title = "",
  ready = true,
  readyMsg = "",
} = defineProps<{
  show?: boolean;
  title?: string;
  ready?: boolean;
  readyMsg?: string;
}>();

const emit = defineEmits<{
  yes: [];
  no: [];
}>();
</script>

<template>
  <Modal :show="show">
    <Card
      class="modal-card"
      :title="title"
    >
      <div class="modal-card">
        <slot></slot>

        <div class="buttons">
          <Button
            class="no"
            value="No"
            @click="emit('no')"
          ></Button>

          <Button
            v-if="ready"
            class="yes"
            value="Yes"
            @click="emit('yes')"
          ></Button>

          <div
            v-else
            class="not-ready"
          >
            {{ readyMsg }}
          </div>
        </div>
      </div>
    </Card>
  </Modal>
</template>

<style scoped>
.modal-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;

    button {
      &.no {
        color: var(--c-red);
      }

      &.yes {
        color: var(--c-green);
      }
    }

    .not-ready {
      display: flex;
      align-items: center;
    }
  }
}
</style>
