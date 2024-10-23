<script setup lang="ts">
import { useSettingsStore } from "@PM/Stores";
import {
  type Vault,
  vaultsLsd,
  vaultsLrt,
  icon,
  label,
} from "@PM/Models/Vault";

const { vault, all = false } = defineProps<{
  vault: Vault | "all";
  all?: boolean;
}>();

const emit = defineEmits<{
  "select-vault": [vault: Vault | "all"];
}>();

// Stores
const storeSettings = useSettingsStore();

// Refs
const vaults: (Vault | "all")[] = [
  ...(all ? ["all" as const] : []),
  ...(storeSettings.flavor === "lsd" ? vaultsLsd : vaultsLrt),
];

// Hooks
onMounted((): void => {
  onVaultSelect(vaults[0]);
});

// Select
const onVaultSelect = (option: Vault | "all"): void => {
  emit("select-vault", option);
};
</script>

<template>
  <Select
    :options="vaults"
    :selected="vault"
    @select="onVaultSelect"
  >
    <template #option="{ option }">
      <div class="option">
        <img
          v-if="option !== 'all'"
          :src="icon(option)"
        />
        <div
          v-else
          class="empty"
        ></div>

        <div class="label">
          {{ option === "all" ? "All" : label(option) }}
        </div>
      </div>
    </template>
  </Select>
</template>

<style scoped>
.option {
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
</style>
