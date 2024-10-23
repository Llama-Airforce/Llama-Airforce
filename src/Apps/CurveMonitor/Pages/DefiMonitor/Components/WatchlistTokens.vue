<script setup lang="ts">
import type { Address } from "@/Framework/Address";
import ModalAddToken from "./ModalAddToken.vue";
import { type Token, initWatchlistTokens } from "../Models";

const emit = defineEmits<{
  tokens: [Token[]];
}>();

const showAddToken = ref(false);

const watchlists = initWatchlistTokens();
const watchlist = ref(watchlists[0]);

const tokens = computed(() => watchlist.value.items);
const selected = ref(new Set<Address>(tokens.value.map((x) => x.address)));

const onSelect = (address: Address) => {
  if (selected.value.has(address)) {
    selected.value.delete(address);
  } else {
    selected.value.add(address);
  }
};

watch(
  selected,
  (selected) => {
    emit(
      "tokens",
      tokens.value.filter((x) => selected.has(x.address))
    );
  },
  { immediate: true, deep: true }
);

watch(watchlist, () => {
  selected.value = new Set(tokens.value.map((x) => x.address));
});

function addToken(token: Token) {
  const alreadyInList = watchlist.value.items.some(
    (item) => item.address === token.address
  );

  if (!alreadyInList) {
    watchlist.value.items.push(token);
  }

  showAddToken.value = false;
}
</script>

<template>
  <div class="watchlist">
    <Select
      class="menu"
      :chevrons="false"
      :options="watchlists"
      :selected="watchlist"
      @input="watchlist = $event"
    >
      <template #item="{ item: { name }, isSelected }">
        <div class="item">
          {{ name }}
          <LucideChevronDown v-if="isSelected" />
        </div>
      </template>
    </Select>

    <div class="toolbar">
      <Button @click="showAddToken = true">+</Button>

      <ModalAddToken
        :show="showAddToken"
        @close="showAddToken = false"
        @token="addToken"
      />
    </div>

    <Table
      :rows="tokens"
      @selected="onSelect($event.address)"
    >
      <template #row="{ item: { address, symbol } }">
        <TokenIcon :address />
        <div>{{ symbol ?? "?" }}</div>

        <div
          class="center"
          @click.stop
        >
          <Checkbox
            :model-value="selected.has(address)"
            @update:model-value="onSelect(address)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.watchlist {
  display: grid;

  gap: 1ch;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "menu toolbar"
    "table table";

  .menu {
    grid-area: menu;

    --c-background: var(--c-lvl0);

    &:deep(.selected) {
      width: min-content;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }

  .toolbar {
    grid-area: toolbar;

    font-size: 1.125rem;
    margin-right: 0.25rem;
  }

  .table {
    grid-area: table;

    --columns-data: 26px 1fr auto;

    font-size: 1rem;
  }
}
</style>
