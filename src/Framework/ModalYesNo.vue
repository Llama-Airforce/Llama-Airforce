<template>
  <Modal :show="show">
    <Card :title="title">
      <slot></slot>

      <div class="buttons">
        <Button
          class="no"
          :value="t('no')"
          @click="emit('no')"
        ></Button>

        <Button
          class="yes"
          :value="t('yes')"
          @click="emit('yes')"
        ></Button>
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Button, Card, Modal } from "@/Framework";

// Props
interface Props {
  show?: boolean;
  title?: string;
}

const { show = false, title = "" } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "yes"): void;
  (e: "no"): void;
}>();

// Methods
const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.modal {
  :deep(.card-body) {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;

    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 3rem;

      button {
        &.no {
          color: rgb(255, 87, 87);
        }

        &.yes {
          margin-right: 1rem;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
yes: Yes
no: No
</i18n>
