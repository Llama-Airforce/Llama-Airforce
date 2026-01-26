<script setup lang="ts">
import { formatEther } from "viem";
import { abi as abiLPxCvx } from "@/ABI/Union/PirexLPxCvx";

// Balances
const { address } = useAccount();

const { data: balancePxCvx, refetch: refetchPxCvx } = useBalance({
  address,
  token: PxCvxAddress,
});

const { data: balanceLPxCvx, refetch: refetchLPxCvx } = useBalance({
  address,
  token: LPxCvxAddress,
});

const { needsApprove, approve, isApproving } = useApprove(
  PxCvxAddress,
  address,
  LPxCvxAddress,
  computed(() => balancePxCvx.value?.value ?? 0n),
  { maxApprove: false },
);

// Wrapping and unwrapping
const {
  data: hashWrapOrUnwrap,
  error: errorWrapOrUnwrap,
  isPending: isPendingWrapOrUnwrap,
  writeContract: writeWrapOrUnwrap,
} = useWriteContract();

const {
  isLoading: isConfirmingWrapOrUnwrap,
  isSuccess: isConfirmedWrapOrUnwrap,
} = useWaitForTransactionReceipt({
  hash: hashWrapOrUnwrap,
});

const isExecuting = computed(
  () => isPendingWrapOrUnwrap.value || isConfirmingWrapOrUnwrap.value,
);

function wrap() {
  writeWrapOrUnwrap({
    abi: abiLPxCvx,
    address: LPxCvxAddress,
    functionName: "wrap",
    args: [balancePxCvx.value?.value ?? 0n] as const,
  });
}

function unwrap() {
  writeWrapOrUnwrap({
    abi: abiLPxCvx,
    address: LPxCvxAddress,
    functionName: "unwrap",
    args: [balanceLPxCvx.value?.value ?? 0n] as const,
  });
}

// Notifications
whenever(errorWrapOrUnwrap, (errorExecute) => {
  notify({ text: prettyError(errorExecute), type: "error" });
});

whenever(errorWrapOrUnwrap, (errorExecute) => {
  notify({ text: prettyError(errorExecute), type: "error" });
});

whenever(isConfirmedWrapOrUnwrap, () => {
  notify({ text: "Executed wrap or unwrap", type: "success" });
  void refetchPxCvx();
  void refetchLPxCvx();
});
</script>

<template>
  <Card title="Wrap">
    <div class="wrap-body">
      <div class="info">
        Wrap and unwrap <strong>pxCVX</strong> and
        <strong>lpxCVX</strong>.<br />
        <br />
        You shouldn't use this if you don't know what you're doing! Normal users
        shouldn't touch these buttons.
      </div>

      <div class="balances">
        <div class="symbol">pxCVX</div>
        <AsyncValue
          show-zero
          class="balance"
          :value="balancePxCvx && +formatEther(balancePxCvx.value)"
        />

        <div class="symbol">lpxCVX</div>
        <AsyncValue
          show-zero
          class="balance"
          :value="balanceLPxCvx && +formatEther(balanceLPxCvx.value)"
        />
      </div>

      <div class="buttons">
        <Button
          v-if="needsApprove"
          class="primary"
          :disabled="isApproving"
          @click="approve"
        >
          {{ isApproving ? "Approving..." : "Approve Wrap" }}
        </Button>

        <Button
          v-else
          class="primary"
          :disabled="
            (balancePxCvx?.value ?? 0n) <= 0n || isExecuting || isApproving
          "
          @click="wrap"
        >
          {{ isApproving ? "Executing..." : "Wrap" }}
        </Button>

        <Button
          class="primary"
          :disabled="(balanceLPxCvx?.value ?? 0n) <= 0n || isExecuting"
          @click="unwrap"
        >
          {{ isApproving ? "Executing..." : "Unwrap" }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.wrap-body {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  a {
    align-self: flex-start;
  }

  button {
    justify-content: center;
  }

  .balances {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .balance {
      justify-self: end;
    }
  }

  .buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
