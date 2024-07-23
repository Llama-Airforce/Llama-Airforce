<template>
  <div class="use-approve">
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
            <Checkbox :model-value="needsApprove"></Checkbox>

            <div>Is approving</div>
            <Checkbox :model-value="isApproving"></Checkbox>
          </div>

          <div class="value">{{ amount }}</div>
          <Slider
            v-model="amount"
            :min="0"
            :max="5"
            :step="1"
          ></Slider>

          <Button
            :value="isApproving ? 'Approving...' : 'Approve'"
            :primary="true"
            :disabled="!needsApprove || isApproving"
            @click="approve"
          ></Button>
        </div>
      </template>

      <template #snippets>
        <Code
          lang="typescript"
          :code
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("use-approve");

.use-approve {
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
