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
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import { notify } from "@kyvg/vue3-notification";
import Card from "@/Framework/Card.vue";
import Button from "@/Framework/Button.vue";
import InputNumber from "@/Framework/InputNumber.vue";
import InputText from "@/Framework/InputText.vue";
import { GaugeFactory__factory } from "@/Contracts";
import { MultisigAddress, veFunderGaugeFactoryAddress } from "@/Util/Addresses";
import { utils } from "ethers";
import { numToBigNumber } from "@/Util/NumberHelper";
import { getProvider } from "@/Wallet/ProviderFactory";

const { t } = useI18n();

// Emits
const emit = defineEmits<{
  (e: "gauge", gauge: string): void;
}>();

let deploying = $ref(false);
const receiver = $ref("");
let amount = $ref(0);

const receiverPlaceholder = $computed((): string => {
  return MultisigAddress;
});

const isValid = $computed(() => {
  return utils.isAddress(receiver.toLocaleLowerCase()) && amount > 0;
});

// Methods
const execute = async (): Promise<void> => {
  const provider = getProvider();
  if (!provider || !receiver || !amount) {
    return;
  }

  const signer = provider.getSigner();
  const gaugeFactory = GaugeFactory__factory.connect(
    veFunderGaugeFactoryAddress,
    signer
  );

  deploying = true;

  if (typeof amount === "string") {
    amount = parseFloat(amount);
  }
  const amountFinal = numToBigNumber(amount, 18);

  try {
    const gauge = await gaugeFactory.deploy_gauge(
      receiver.toLocaleLowerCase(),
      amountFinal
    );
    emit("gauge", gauge as unknown as string);
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ text: err.message, type: "error" });
    }
  } finally {
    deploying = false;
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.add-new {
  ::v-deep(.card-body) {
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
          font-size: 0.875rem;
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
