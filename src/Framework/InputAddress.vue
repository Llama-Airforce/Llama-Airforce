<script setup lang="ts">
import { normalize } from "viem/ens";
import { useEnsAddress, useEnsName } from "@wagmi/vue";
import type { Address } from "@/Framework/Address";
import { addressShort } from "@/Wallet";

type User = typeof user.value;

const modelValue = defineModel<string>({ required: true, default: "" });
const modelValueDebounced = refDebounced(modelValue, 300);

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
    modelValue.value !== modelValueDebounced.value ||
    ensAddress.isFetching.value ||
    ensName.isFetching.value
);

const user = computed(() => {
  // Determine the address based on input type
  const address = modelValue.value.startsWith("0x")
    ? modelValue.value // Use input directly if it starts with '0x' (likely an address)
    : ensAddress.data.value ?? EmptyAddress; // Otherwise, use resolved ENS address or fallback

  // Determine the name based on input type
  const name = modelValue.value.startsWith("0x")
    ? ensName.data.value && !isAddress(ensName.data.value, { strict: false })
      ? ensName.data.value // Use resolved ENS name if available and not an address
      : "" // Fallback to empty string if no valid ENS name
    : modelValue.value; // Use input directly if it doesn't start with '0x' (likely an ENS name)

  return {
    address,
    name,
  };
});

const optionsShow = ref(true);
const options = computed(() => (optionsShow.value ? [user.value] : []));

const valid = computed(
  () =>
    !!modelValue.value &&
    options.value.length > 0 &&
    !loading.value &&
    isAddress(user.value.address, { strict: false })
);

const selected = ref(modelValue.value);
const ignoreModelValueWatch = ref(false);

function onUser(user: User) {
  optionsShow.value = false;
  selected.value = user.address;

  ignoreModelValueWatch.value = true;
  emit("select", user);

  void nextTick(() => {
    ignoreModelValueWatch.value = false;
  });
}

watch(
  modelValue,
  () => {
    if (!ignoreModelValueWatch.value) {
      optionsShow.value = true;
    }
  },
  { flush: "post" }
);

defineExpose({ selected });
</script>

<template>
  <form
    class="input-address"
    @submit.prevent="valid && onUser(user)"
  >
    <InputText
      v-model="modelValue"
      search
      placeholder="Wallet address"
      :options
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
