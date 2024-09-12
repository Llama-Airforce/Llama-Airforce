<script setup lang="ts">
import { mainnet } from "viem/chains";
import { abi as abiVeCRV } from "@/ABI/Curve/VeCRV";
import { abi as abiVoting } from "@/ABI/Curve/VotingCurve";
import { useWallet } from "@/Wallet";
import { type Proposal, getStatus } from "@CM/Services/Proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Refs
const { address } = useWallet();

const showVote = ref(false);
const yeaPct = ref(50);

const editor = useTemplateRef<HTMLSpanElement>("editor");
const endsWithDot = ref(false);

const yeaPctStr = computed(() => {
  if (endsWithDot.value) return `${yeaPct.value}.`;

  if (yeaPct.value === 0 && editor.value?.textContent !== "0") {
    return "";
  }

  return yeaPct.value.toString();
});

const canVote = computed(
  () =>
    (votingPower.value ?? 0n) > 0n &&
    !voting.value &&
    isVoteOpen.value &&
    voterState.value === 0
);

const voteButtonText = computed(() => {
  if (canVote.value) {
    return "Submit";
  }

  if (voting.value) {
    return "Voting...";
  }

  if (!isVoteOpen.value) {
    return "Voting closed";
  }

  if (voterState.value !== 0) {
    return "You've already voted";
  }

  return "Not enough voting power";
});

const votingPowerNumber = computed(() =>
  bigNumToNumber(votingPower.value ?? 0n, 18n)
);

const isVoteOpen = computed(() => getStatus(proposal) === "active");
const executable = computed(() => getStatus(proposal) === "passed");

// Methods
const getCursorPosition = (): number => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    return range.startOffset;
  }
  return 0;
};

const setCursorPosition = (position: number) => {
  if (editor.value) {
    const range = document.createRange();
    range.setStart(editor.value.firstChild ?? editor.value, position);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

const selectNo = () => {
  yeaPct.value = 0;
  if (editor.value) {
    editor.value.textContent = "0";
  }
};

const selectYes = () => {
  yeaPct.value = 100;
  if (editor.value) {
    editor.value.textContent = "100";
  }
};

// Events
const onEdit = (event: Event) => {
  // Don't process event if actual contenteditable is clicked.
  if (event.target !== event.currentTarget) {
    return;
  }

  if (!editor.value) {
    return;
  }

  editor.value.focus();
};

const validate = () => {
  if (editor.value) {
    const inputValue = editor.value.textContent ?? "";
    const cursorPosition = getCursorPosition();

    // Check if input value is a decimal number or ends with a dot
    if (/^\d*(\.\d*)?$/.test(inputValue)) {
      endsWithDot.value = inputValue.endsWith(".");

      if (inputValue) {
        const newVal = parseFloat(inputValue);

        // Prevent NaN and Infinity.
        if (newVal >= 0 && newVal <= 100) {
          yeaPct.value = newVal;
        } else {
          // If not, revert to the previous valid value
          editor.value.textContent = yeaPctStr.value;
          setCursorPosition(cursorPosition - 1); // Restore the cursor position
        }
      } else {
        yeaPct.value = 0;
      }
    } else {
      // If not, revert to the previous valid value
      editor.value.textContent = yeaPctStr.value;
      setCursorPosition(cursorPosition - 1); // Restore the cursor position
    }
  }
};

// Data
const { data: veCrvAddress } = useReadContract({
  abi: abiVoting,
  address: CurveVotingAddress,
  functionName: "token",
  query: {
    enabled: showVote,
  },
});

const { data: voterState } = useReadContract({
  abi: abiVoting,
  address: CurveVotingAddress,
  functionName: "getVoterState",
  args: computed(() => [BigInt(proposal.id), address.value!] as const),
  query: {
    enabled: computed(() => !!address.value && showVote.value),
    initialData: 0,
    initialDataUpdatedAt: 0,
  },
});

const { data: votingPower } = useReadContract({
  abi: abiVeCRV,
  address: veCrvAddress,
  functionName: "balanceOfAt",
  args: computed(() => [address.value!, BigInt(proposal.block)] as const),
  query: {
    enabled: computed(
      () => !!veCrvAddress.value && !!address.value && showVote.value
    ),
    initialData: 0n,
    initialDataUpdatedAt: 0,
  },
});

const { data: canExecute, refetch: refetchCanExecute } = useReadContract({
  abi: abiVoting,
  address: CurveVotingAddress,
  functionName: "canExecute",
  args: [BigInt(proposal.id)],
  query: {
    enabled: computed(() => executable.value && showVote.value),
    initialData: false,
    initialDataUpdatedAt: 0,
  },
});

const { data: pctBase } = useReadContract({
  abi: abiVoting,
  address: CurveVotingAddress,
  functionName: "PCT_BASE",
  query: {
    enabled: showVote,
  },
});

// Voting
const {
  data: hashVote,
  error: errorVote,
  isPending: isPendingVote,
  writeContract: writeContractVote,
} = useWriteContract();

const { isLoading: isConfirmingVote, isSuccess: isConfirmedVote } =
  useWaitForTransactionReceipt({
    hash: hashVote,
  });

const voting = computed(() => isPendingVote.value || isConfirmingVote.value);

function vote() {
  // PCT_BASE = 10 ** 18; // 0% = 0; 1% = 10^16; 100% = 10^18
  if (!pctBase.value) {
    notify({ text: prettyError("Missing PCT_BASE"), type: "error" });
    return;
  }

  const decimals = BigInt(Math.log10(Number(pctBase.value)));
  const yea = numToBigNumber(yeaPct.value / 100, decimals);
  const nay = pctBase.value - yea;

  writeContractVote({
    abi: abiVoting,
    address: CurveVotingAddress,
    functionName: "votePct",
    args: [BigInt(proposal.id), yea, nay, false] as const,
  });
}

// Notifications
whenever(errorVote, (error) => {
  notify({ text: prettyError(error), type: "error" });
});

whenever(isConfirmedVote, () => {
  notify({ text: "Voted", type: "success" });
});

// Execute
const {
  data: hashExecute,
  error: errorExecute,
  isPending: isPendingExecute,
  writeContract: writeContractExecute,
} = useWriteContract();

const { isLoading: isConfirmingExecute, isSuccess: isConfirmedExecute } =
  useWaitForTransactionReceipt({
    hash: hashExecute,
  });

const executing = computed(
  () => isPendingExecute.value || isConfirmingExecute.value
);

function execute() {
  writeContractExecute({
    abi: abiVoting,
    address: CurveVotingAddress,
    functionName: "executeVote",
    args: [BigInt(proposal.id)],
  });

  void refetchCanExecute();
}

// Notifications
whenever(errorExecute, (errorExecute) => {
  notify({ text: prettyError(errorExecute), type: "error" });
});

whenever(isConfirmedExecute, () => {
  notify({ text: "Executed proposal", type: "success" });
});
</script>

<template>
  <div class="buttons">
    <Button
      class="primary"
      value="Vote"
      @click="showVote = true"
    ></Button>

    <Button
      v-if="executable"
      class="primary"
      :value="executing ? 'Executing...' : 'Execute'"
      :disabled="!canExecute || executing"
      @click="execute"
    ></Button>
  </div>

  <Modal
    :show="showVote"
    @close="showVote = false"
  >
    <Card
      title="Vote with veCRV"
      class="vote-content"
    >
      <div class="vecrv">
        <div class="info">
          <div class="kpis">
            <KPI
              label="Voting power"
              :has-value="true"
            >
              <AsyncValue
                :value="votingPowerNumber"
                :precision="2"
                type="dollar"
                :show-symbol="false"
                :show-zero="true"
              />
              veCRV
            </KPI>

            <KPI
              label="Block"
              :value="proposal.block"
              :has-value="true"
            >
            </KPI>
          </div>

          <div class="description">
            <span class="title">Description: </span>
            <span>{{ proposal.metadata }}</span>
          </div>
        </div>

        <div class="options">
          <Button
            class="no"
            :class="{ winning: yeaPct < 50 }"
            :disabled="!canVote"
            @click="selectNo"
          >
            <span class="label">No</span>
          </Button>

          <div class="middle">
            <i
              class="fas fa-times"
              :class="{ winning: yeaPct < 50 }"
            ></i>

            <div
              class="value"
              :class="{ disabled: !canVote }"
              @click="onEdit"
            >
              <span
                ref="editor"
                :contenteditable="canVote"
                @input="validate"
                v-text="yeaPctStr"
              >
              </span>
              %
            </div>

            <i
              class="fas fa-check"
              :class="{ winning: yeaPct > 50 }"
            ></i>
          </div>

          <Button
            class="yes"
            :class="{ winning: yeaPct > 50 }"
            :disabled="!canVote"
            @click="selectYes"
          >
            <span class="label">Yes</span>
          </Button>
        </div>

        <Slider
          v-model="yeaPct"
          class="slider"
          :disabled="!canVote"
          :min="0"
          :max="100"
        ></Slider>

        <Button
          class="submit primary"
          :value="voteButtonText"
          :disabled="!canVote"
          :chain-id="mainnet.id"
          @click="vote"
        ></Button>
      </div>
    </Card>
  </Modal>
</template>

<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vote-content {
  width: 33vw;

  @media only screen and (max-width: 1280px) {
    & {
      width: 80vw;
    }
  }

  .vecrv {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;

    > .info {
      width: 100%;

      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-size: 1rem;

      > .description {
        display: flex;
        flex-direction: column;

        > .title {
          font-weight: bold;
        }
      }

      > .kpis {
        display: flex;
        gap: 1rem;

        > .kpi {
          background: var(--c-lvl0);
        }
      }
    }

    > .options {
      position: relative;

      width: 100%;
      display: flex;
      font-size: 1.125rem;

      > button {
        flex-grow: 1;
        height: 2rem;

        background: var(--c-lvl2);

        &:hover:not(:disabled) {
          background: var(--c-lvl3);
        }

        &:active:not(:disabled) {
          background: var(--c-lvl4);
        }

        &.no {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;

          &.winning {
            background: var(--c-red);
          }
        }

        &.yes {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;

          justify-content: end;

          &.winning {
            background: var(--c-green);
          }
        }

        &.winning {
          .label {
            color: var(--c-text-invert);
          }
        }
      }

      > .middle {
        position: absolute;
        inset: 0;
        margin: auto;

        width: min-content;
        height: 4rem;

        display: flex;
        align-items: center;
        gap: 2rem;

        i.winning {
          color: var(--c-text-invert);
        }

        > .value {
          min-width: 3rem;
          height: 100%;
          padding: 0 1.5rem;

          display: flex;
          justify-content: center;
          align-items: center;

          background: var(--c-lvl1);
          outline: 0.33rem solid var(--c-primary);
          border-radius: 0.25rem;

          transition: background-color 125ms ease;

          &:hover:not(.disabled) {
            background: var(--c-lvl1-hover);
            cursor: text;
          }

          [contenteditable] {
            outline: 0px solid transparent;
          }
        }
      }
    }

    > .slider {
      width: 100%;
    }

    > .submit {
      align-self: stretch;
      justify-content: center;
      font-size: 1.125rem;
      margin: 0 0 0.5rem 0;
      padding: 1rem;
    }
  }
}
</style>
