<template>
  <Select
    class="select"
    :options="vaults"
    :selected="vault"
    :open="vaultOpen"
    @open="onVaultOpen"
    @close="vaultOpen = false"
    @input="onVaultSelect"
  >
    <template #item="props: { item: Vault | 'all' }">
      <div
        v-if="props.item"
        class="item"
      >
        <img
          v-if="props.item !== 'all'"
          :src="icon(props.item)"
        />
        <div
          v-else
          class="empty"
        ></div>

        <div class="label">
          {{ props.item === "all" ? "All" : label(props.item) }}
        </div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { Select } from "@/Framework";
import { useSettingsStore } from "@PM/Stores";
import {
  type Vault,
  vaultsLsd,
  vaultsLrt,
  icon,
  label,
} from "@PM/Models/Vault";

// Props
interface Props {
  vault: Vault | "all" | null;
  all?: boolean;
}

const { vault = null, all = false } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "select-vault": [vault: Vault | "all"];
}>();

// Stores
const storeSettings = useSettingsStore();

// Refs
const vaultOpen = ref(false);

const vaults: (Vault | "all")[] = [
  ...(all ? ["all" as const] : []),
  ...(storeSettings.flavor === "lsd" ? vaultsLsd : vaultsLrt),
];

// Hooks
onMounted((): void => {
  onVaultSelect(vaults[0]);
});

// Events
const onVaultOpen = (): void => {
  vaultOpen.value = !vaultOpen.value;
};

const onVaultSelect = (option: unknown): void => {
  const vaultInfo = option as Vault | "all";
  emit("select-vault", vaultInfo);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

::v-deep(.select) {
  .item {
    display: flex;
    align-items: center;

    img,
    .empty {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    > .label {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}
</style>
