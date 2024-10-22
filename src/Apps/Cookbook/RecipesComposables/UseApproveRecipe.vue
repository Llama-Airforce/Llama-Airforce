<script setup lang="ts">
import { zeroAddress } from "viem";
import { useApprove } from "@/Framework/Composables/UseApprove";
import { useWallet } from "@/Wallet";
import Recipe from "@CB/Recipe.vue";

const { address } = useWallet();

const token = WEthAddress;
const spender = TreasuryAddress;
const amount = ref(0);

const { allowance, needsApprove, approve, isApproving } = useApprove(
  token,
  address,
  spender,
  computed(() => BigInt(amount.value)),
  { maxApprove: false }
);

const code = `const { address } = useWallet();

const token = WEthAddress;
const spender = TreasuryAddress;
const amount = ref(0);

const { allowance, needsApprove, approve, isApproving } = useApprove(
  token,
  address,
  spender,
  computed(() => BigInt(amount.value)),
  { maxApprove: false }
);
`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Approval">
      <template #example>
        <div class="approval">
          <div class="info">
            <div>Token</div>
            <div class="font-mono">{{ token ?? zeroAddress }}</div>

            <div>Owner</div>
            <div class="font-mono">{{ address ?? zeroAddress }}</div>

            <div>Spender</div>
            <div class="font-mono">{{ spender ?? zeroAddress }}</div>

            <div>Current allowance</div>
            <div>{{ allowance }}</div>

            <div>Needs approve</div>
            <Checkbox :model-value="needsApprove" />

            <div>Is approving</div>
            <Checkbox :model-value="isApproving" />
          </div>

          <div class="value">{{ amount }}</div>
          <Slider
            v-model="amount"
            :min="0"
            :max="5"
            :step="1"
          />

          <Button
            class="primary"
            :disabled="!needsApprove || isApproving"
            @click="approve"
          >
            {{ isApproving ? "Approving..." : "Approve" }}
          </Button>
        </div>
      </template>

      <template #snippets>
        <Code
          lang="typescript"
          :code
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr;

  .approval {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > .info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
}
</style>
