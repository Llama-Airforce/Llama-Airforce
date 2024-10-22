<script setup lang="ts">
import { encodeFunctionData } from "viem";
import { mainnet } from "viem/chains";
import { abi as abiAgent } from "@/ABI/veFunder/AragonAgent";
import { abi as abiVoting } from "@/ABI/veFunder/AragonVoting";
import { abi as abiGauge } from "@/ABI/veFunder/GaugeController";
import { type Address } from "@/Framework/Address";

const { gauge = "" } = defineProps<{
  gauge?: string;
}>();

const emit = defineEmits<{
  request: [];
}>();

// Refs
const creating = ref(false);
const gauge_ = ref("");
const description = ref("Add a grant gauge: ");

const gaugePlaceholder = computed((): string => {
  return MultisigAddress;
});

const isValid = computed(
  (): boolean => isAddress(gauge_.value) && !!description.value
);

const canRequest = computed((): boolean => {
  return isValid.value && !creating.value;
});

// Watches
watch(
  () => gauge,
  (gauge) => {
    gauge_.value = gauge.toLocaleLowerCase();
  }
);

// Methods
async function execute() {
  if (!gauge_.value) {
    return;
  }

  return tryNotifyLoading(creating, async () => {
    await createVote();
    emit("request");
  });
}

const config = useConfig();
async function createVote() {
  const ARAGON_OWNERSHIP_VOTING = "0xe478de485ad2fe566d49342cbd03e49ed7db3356";
  const ARAGON_OWNERSHIP_AGENT = "0x40907540d8a6c65c637785e8f8b742ae6b0b9968";
  const zeroPad = (num: string, places: number) =>
    String(num).padStart(places, "0");

  const call_data = encodeFunctionData({
    abi: abiGauge,
    functionName: "add_gauge",
    args: [gauge_.value as Address, 10n, 0n],
  });

  let evm_script = "0x00000001" as Address;

  const agent_calldata = encodeFunctionData({
    abi: abiAgent,
    functionName: "execute",
    args: [veFunderGaugeController, 0n, call_data],
  }).substring(2);

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
  const ipfs_hash = ipfs_data.Hash;

  const hash = await writeContract(config, {
    abi: abiVoting,
    address: ARAGON_OWNERSHIP_VOTING,
    functionName: "newVote",
    args: [evm_script, `ipfs:${ipfs_hash}`, false, false],
  });

  await waitForTransactionReceipt(config, { hash });
}
</script>

<template>
  <Card title="Gauge Addition Vote">
    <div class="add-new">
      <div class="form">
        <div class="field">
          <div class="label">Gauge Address:</div>
          <div class="value">
            <InputText
              v-model="gauge_"
              :placeholder="gaugePlaceholder"
            />
          </div>
        </div>

        <div class="field">
          <div class="label">Vote Description:</div>
          <div class="value">
            <InputText v-model="description" />
          </div>
        </div>
      </div>

      <Button
        class="action-button request primary"
        :disabled="!canRequest"
        :chain-id="mainnet.id"
        @click="execute"
      >
        Create Gauge Addition Vote
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
