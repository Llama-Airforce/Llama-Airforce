<script setup lang="ts">
import { normalize } from "viem/ens";
import type { Address } from "@/types/address";
import { useEnsAddress, useEnsName } from "@wagmi/vue";

type User = typeof user.value;

const modelValue = defineModel<string>({ required: true, default: "" });
const modelValueTrimmed = computed(() => modelValue.value.trim());
const modelValueDebounced = refDebounced(modelValueTrimmed, 300);

const emit = defineEmits<{
  select: [option: User];
}>();

const ensAddress = useEnsAddress({
  name: computed(() =>
    modelValueDebounced.value.endsWith(".eth")
      ? (normalize(modelValueDebounced.value) as Address)
      : undefined
  ),
});

const ensName = useEnsName({
  address: computed(() =>
    isAddress(modelValueDebounced.value, { strict: false })
      ? (normalize(modelValueDebounced.value) as Address)
      : undefined
  ),
});

const loading = computed(
  () =>
    modelValueTrimmed.value !== modelValueDebounced.value ||
    ensAddress.isFetching.value ||
    ensName.isFetching.value
);

const user = computed(() => {
  // Determine the address based on input type
  const address = modelValueTrimmed.value.startsWith("0x")
    ? modelValueTrimmed.value // Use input directly if it starts with '0x' (likely an address)
    : ensAddress.data.value ?? EmptyAddress; // Otherwise, use resolved ENS address or fallback

  // Determine the name based on input type
  const name = modelValueTrimmed.value.startsWith("0x")
    ? ensName.data.value && !isAddress(ensName.data.value, { strict: false })
      ? ensName.data.value // Use resolved ENS name if available and not an address
      : "" // Fallback to empty string if no valid ENS name
    : modelValueTrimmed.value; // Use input directly if it doesn't start with '0x' (likely an ENS name)

  return {
    address,
    name,
  };
});

const optionsOpen = ref(false);
const options = computed(() => [user.value]);

const valid = computed(
  () =>
    !!modelValueTrimmed.value &&
    options.value.length > 0 &&
    !loading.value &&
    isAddress(user.value.address, { strict: false }) &&
    user.value.address !== EmptyAddress
);

const selected = ref(modelValue.value);

function onUser(user: User) {
  if (!valid.value) {
    optionsOpen.value = true;
    return;
  }

  optionsOpen.value = false;
  selected.value = user.address;

  emit("select", user);
}

const internalChange = ref(false);
watch(modelValueTrimmed, () => {
  if (internalChange.value) {
    optionsOpen.value = true;
    internalChange.value = false;
  }
});

defineExpose({ selected });
</script>

<template>
  <form
    class="input-address"
    @submit.prevent="valid && onUser(user)"
  >
    <InputText
      v-model="modelValue"
      v-model:open="optionsOpen"
      search
      placeholder="Wallet address"
      :options
      @update:model-value="internalChange = true"
      @select="onUser"
    >
      <template #icon>
        <Blockie
          v-if="selected !== '' && selected === modelValue"
          size="small"
          :address="user.address"
        />

        <LucideSearch v-else />
      </template>

      <template #option="{ option: { address, name } }">
        <div class="ens">
          <Blockie :address="user.address" />
          <div class="address">{{ addressShort(address ?? "", 12) }}</div>
          <div class="name">{{ name }}</div>

          <Spinner
            size="small"
            :loading
          />
        </div>
      </template>
    </InputText>

    <Button
      class="primary"
      :disabled="!valid"
      @click="onUser(user)"
    >
      <LucideArrowRight />
    </Button>
  </form>
</template>

<style scoped>
.input-address {
  display: flex;
  gap: 1rem;

  .ens {
    display: flex;
    align-items: center;
    gap: 1.5ch;

    font-size: 1rem;

    .name {
      flex-grow: 1;
      color: var(--c-lvl5);
      font-style: italic;
    }
  }
}
</style>
