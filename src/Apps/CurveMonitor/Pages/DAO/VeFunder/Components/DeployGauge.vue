<script setup lang="ts">
import { mainnet } from "viem/chains";
import type { Address } from "@/Types/Address";
import { abi } from "@/ABI/veFunder/GaugeFactory";

const emit = defineEmits<{
  gauge: [gauge: Address];
}>();

// Refs
const deploying = ref(false);
const receiver = ref("");
const amount: Ref<number | string> = ref(0);

const receiverPlaceholder = computed((): string => {
  return MultisigAddress;
});

const isValid = computed(
  () =>
    isAddress(receiver.value.toLocaleLowerCase()) &&
    typeof amount.value === "number" &&
    amount.value > 0
);

const config = useConfig();
async function execute() {
  const receiverAddress = receiver.value.toLocaleLowerCase() as Address;

  if (typeof amount.value === "string") {
    amount.value = parseFloat(amount.value);
  }
  const amountFinal = numToBigNumber(amount.value, 18n);

  return tryNotifyLoading(deploying, async () => {
    const { result, request } = await simulateContract(config, {
      abi,
      address: veFunderGaugeFactoryAddress,
      functionName: "deploy_gauge",
      args: [receiverAddress, amountFinal] as const,
    });

    const hash = await writeContract(config, request);
    await waitForTransactionReceipt(config, { hash });

    emit("gauge", result as unknown as Address);
  });
}
</script>

<template>
  <Card title="Gauge Creation">
    <div class="add-new">
      <div class="form">
        <div class="field">
          <div class="label">Receiver:</div>
          <div class="value">
            <InputText
              v-model="receiver"
              :placeholder="receiverPlaceholder"
            />
          </div>
        </div>

        <div class="field">
          <div class="label">CRV Amount (Max):</div>
          <div class="value">
            <InputNumber
              v-model="amount"
              :min="1"
              :max="3303030299"
            />
          </div>
        </div>
      </div>

      <Button
        class="action-button request primary"
        :disabled="!isValid || deploying"
        :chain-id="mainnet.id"
        @click="execute"
      >
        Create Fundraising Gauge
      </Button>
    </div>
  </Card>
</template>

<style scoped>
.add-new {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 0.75rem !important;
  margin-bottom: 1.5rem !important;

  > .form {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    > .field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      > .label {
        display: flex;
        margin-left: 0.1rem;
      }

      > .value {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
    }
  }

  .request {
    justify-content: center;
  }
}
</style>
