<script setup lang="ts">
import { initWatchlistTokens, type Token } from "../Models";

const emit = defineEmits<{
  close: [];
  token: [token: Token];
}>();

const search = ref("");

const tokens = initWatchlistTokens().flatMap((x) => x.items);
</script>

<template>
  <Modal @close="emit('close')">
    <Card title="Add token">
      <div class="add-token">
        <InputText
          v-model="search"
          class="search"
          placeholder="Search for tokens"
          :search="true"
        >
        </InputText>

        <Table
          :rows="tokens"
          @selected="emit('token', $event)"
        >
          <template #row="{ item: { address, symbol } }">
            <TokenIcon :address="address"></TokenIcon>
            <div>{{ symbol ?? "?" }}</div>
          </template>
        </Table>
      </div>
    </Card>
  </Modal>
</template>

<style scoped>
.add-token {
  width: 33vw;
  max-height: 75dvh;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media only screen and (max-width: 1280px) {
    width: 80vw;
  }

  .table {
    --columns-data: 26px minmax(10ch, 20ch) 1fr;
  }
}
</style>
