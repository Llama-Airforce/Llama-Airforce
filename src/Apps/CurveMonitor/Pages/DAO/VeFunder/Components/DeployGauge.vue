<template>
  <Card
    class="add-new"
    title="Gauge Creation"
  >
    <div class="form">
      <div class="field">
        <div class="label">{{ t("receiver") }}:</div>
        <div class="value">
          <InputText
            v-model="receiver"
            :placeholder="receiverPlaceholder"
          ></InputText>
        </div>
      </div>

      <div class="field">
        <div class="label">{{ t("amount") }}:</div>
        <div class="value">
          <InputNumber
            v-model="amount"
            :min="1"
            :max="3303030299"
          ></InputNumber>
        </div>
      </div>
    </div>

    <Button
      class="action-button request"
      :value="t('submit')"
      :disabled="!isValid || deploying"
      :primary="true"
      :web3="true"
      @click="execute"
    ></Button>
  </Card>
</template>

<script setup lang="ts">
import { type Address } from "@/Framework/Address";
import { abi } from "@/ABI/veFunder/GaugeFactory";

const { t } = useI18n();

// Emits
const emit = defineEmits<{
  gauge: [gauge: Address];
}>();

// Refs
const deploying = ref(false);
const receiver = ref("");
const amount = ref(0);

const receiverPlaceholder = computed((): string => {
  return MultisigAddress;
});

const isValid = computed(
  () => isAddress(receiver.value.toLocaleLowerCase()) && amount.value > 0
);

const config = useConfig();
async function execute() {
  if (!receiver.value || !amount.value) {
    return;
  }

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

    emit("gauge", result as Address);
  });
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.add-new {
  :deep(.card-body) {
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
}
</style>

<i18n lang="yaml" locale="en">
receiver: Receiver
amount: CRV Amount (Max)
submit: Create Fundraising Gauge
</i18n>
