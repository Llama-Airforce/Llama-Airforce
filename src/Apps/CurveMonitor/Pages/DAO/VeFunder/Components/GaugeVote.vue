<template>
  <Card
    class="add-new"
    title="Gauge Addition Vote"
  >
    <div class="form">
      <div class="field">
        <div class="label">{{ t("gauge") }}:</div>
        <div class="value">
          <InputText
            v-model="gauge_"
            :placeholder="gaugePlaceholder"
          ></InputText>
        </div>
      </div>

      <div class="field">
        <div class="label">{{ t("description") }}:</div>
        <div class="value">
          <InputText v-model="description"></InputText>
        </div>
      </div>
    </div>

    <Button
      class="action-button request"
      :value="t('submit')"
      :disabled="!canRequest"
      :primary="true"
      :web3="true"
      @click="execute"
    ></Button>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Signer, utils } from "ethers";
import { notify } from "@kyvg/vue3-notification";
import { Card, Button, InputText } from "@/Framework";
import { getProvider } from "@/Wallet";
import {
  AragonAgent__factory,
  AragonVoting__factory,
  GaugeController__factory,
} from "@/Contracts";
import { MultisigAddress, veFunderGaugeController } from "@/Util/Addresses";

const { t } = useI18n();

// Props
interface Props {
  gauge?: string;
}

// Emits
const emit = defineEmits<{
  (e: "request"): void;
}>();

const { gauge = "" } = defineProps<Props>();

const creating = ref(false);
const gauge_ = ref("");
const description = ref(t("placeholder"));

const gaugePlaceholder = computed((): string => {
  return MultisigAddress;
});

const isValid = computed((): boolean => {
  return utils.isAddress(gauge_.value) && !!description.value;
});

const canRequest = computed((): boolean => {
  return isValid.value && !creating.value;
});

// Watches
watch(
  () => gauge,
  (newGauge) => {
    gauge_.value = newGauge.toLocaleLowerCase();
  }
);

// Methods
const execute = async (): Promise<void> => {
  const provider = getProvider();
  if (!provider || !gauge_.value) {
    return;
  }

  const signer = provider.getSigner();

  creating.value = true;

  try {
    await createVote(signer);
    emit("request");
  } catch (err: unknown) {
    if (err instanceof Error) {
      notify({ text: err.message, type: "error" });
    }
  } finally {
    creating.value = false;
  }
};

const createVote = async (signer: Signer): Promise<void> => {
  const ARAGON_OWNERSHIP_VOTING = "0xe478de485ad2fe566d49342cbd03e49ed7db3356";
  const ARAGON_OWNERSHIP_AGENT = "0x40907540d8a6c65c637785e8f8b742ae6b0b9968";
  const zeroPad = (num: string, places: number) =>
    String(num).padStart(places, "0");

  const gaugeController = GaugeController__factory.createInterface();
  const agent = AragonAgent__factory.createInterface();
  const gaugeType = "10";

  const call_data = gaugeController.encodeFunctionData("add_gauge", [
    gauge_.value,
    gaugeType,
    0,
  ]);

  let evm_script = "0x00000001";
  const agent_calldata = agent
    .encodeFunctionData("execute", [veFunderGaugeController, 0, call_data])
    .substring(2);

  const length = zeroPad(
    (Math.floor(agent_calldata.length) / 2).toString(16),
    8
  );

  evm_script = `${evm_script}${ARAGON_OWNERSHIP_AGENT.substring(
    2
  )}${length}${agent_calldata}`;

  const data = new FormData();
  const vote_description = description.value.replace(/(\r\n|\n|\r)/gm, ""); //remove line returns cause bah gawd
  const vote_data = {
    text: vote_description,
  };
  data.append("file", JSON.stringify(vote_data));
  const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: "POST",
    body: data,
  });
  const ipfs_data = (await response.json()) as Record<string, string>;
  const ipfs_hash = ipfs_data["Hash"] as string;

  const voting = AragonVoting__factory.connect(ARAGON_OWNERSHIP_VOTING, signer);

  await voting.newVote(evm_script, `ipfs:${ipfs_hash}`, false, false, {
    gasLimit: 1000000,
  });
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
gauge: Gauge Address
description: Vote Description
placeholder: "Add a grant gauge: "
submit: Create Gauge Addition Vote
</i18n>
