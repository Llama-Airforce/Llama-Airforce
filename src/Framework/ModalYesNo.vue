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
          v-if="ready"
          class="yes"
          :value="t('yes')"
          @click="emit('yes')"
        ></Button>

        <div
          v-else
          class="not-ready"
        >
          {{ readyMsg }}
        </div>
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
// Props
interface Props {
  show?: boolean;
  title?: string;
  ready?: boolean;
  readyMsg?: string;
}

const {
  show = false,
  title = "",
  ready = true,
  readyMsg = "",
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  yes: [];
  no: [];
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
      margin-top: 2rem;

      button {
        &.no {
          color: var(--c-red);
        }

        &.yes {
          color: var(--c-green);
          margin-right: 1rem;
        }
      }

      .not-ready {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
yes: Yes
no: No
</i18n>

<i18n lang="yaml" locale="zh">
yes: 是的
no: 不是
</i18n>
