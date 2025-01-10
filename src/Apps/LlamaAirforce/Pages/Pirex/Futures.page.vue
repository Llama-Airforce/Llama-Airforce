<script setup lang="ts">
import { abi } from "@/ABI/Union/Pirex";
import useApproveForAll from "./Composables/UseApprovalForAll";

const { address } = useWallet();

const { isApprovedForAll, approve, approving } = useApproveForAll(address);

const epoch = ref<number | null>(null);

const { execute: claimFutures, isExecuting: claimingFutures } =
  useExecuteContract(
    (writeContract) => {
      writeContract({
        address: PirexCvxAddress,
        abi,
        functionName: "redeemFuturesRewards",
        args: [BigInt(epoch.value!), address.value!] as const,
      });
    },
    {
      successMessage: `Successfully claimed futures rewards!`,
    }
  );
</script>

<template>
  <div class="dashboard">
    <Card>
      <div class="approval">
        To swap the futures reward NFTs for the actual bribe rewards, you need
        to give a one time approval to the swap contract at:

        <Button
          class="primary"
          :disabled="approving || isApprovedForAll"
          @click="approve"
        >
          {{
            isApprovedForAll
              ? "Approved"
              : "Approve Futures Claim Zap (only once needed)"
          }}
        </Button>
      </div>
    </Card>

    <Card>
      <div class="claim">
        Epoch:
        <InputNumber
          v-model="epoch"
          placeholder="1735776000"
          :min="0"
          :max="Infinity"
        />

        <Button
          class="primary"
          :disabled="!isApprovedForAll || claimingFutures || !epoch"
          @click="claimFutures"
        >
          Claim Futures Rewards
        </Button>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }

  .approval {
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .claim {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
}
</style>
