<template>
  <div class="buttons">
    <Button
      :value="t('vote')"
      :primary="true"
      @click="showVote = true"
    ></Button>

    <Button
      v-if="executable"
      :value="t(executing ? 'executing' : 'execute')"
      :primary="true"
      :disabled="!canExecute || executing"
      @click="execute"
    ></Button>
  </div>

  <Modal
    class="vote-modal"
    :show="showVote"
    @close="showVote = false"
  >
    <Card
      :title="t('vote-with-vecrv')"
      class="vote-content"
    >
      <div class="vecrv">
        <div class="info">
          <div class="kpis">
            <KPI
              :label="t('voting-power')"
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
              :label="t('block')"
              :value="proposal.block"
              :has-value="true"
            >
            </KPI>
          </div>

          <div class="description">
            <span class="title">{{ t("description") }}: </span>
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
            <span class="label"> {{ t("no") }}</span>
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
            <span class="label"> {{ t("yes") }}</span>
          </Button>
        </div>

        <Slider
          class="slider"
          :disabled="!canVote"
          :min="0"
          :max="100"
          :model-value="yeaPct"
          @update:model-value="onYeaPct"
        ></Slider>

        <Button
          class="submit"
          :value="t(voteButtonText)"
          :primary="true"
          :disabled="!canVote"
          :web3="true"
          @click="vote"
        ></Button>
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { VeCRV__factory, VotingCurve__factory } from "@/Contracts";
import { AsyncValue, KPI, Button, Card, Modal, Slider } from "@/Framework";
import {
  tryNotify,
  tryNotifyLoading,
  bigNumToNumber,
  numToBigNumber,
} from "@/Util";
import { CurveVotingAddress } from "@/Util/Addresses";
import { useWallet } from "@/Wallet";
import type { Proposal } from "@CM/Pages/DAO/Proposals/Models/Proposal";
import { getStatus } from "@CM/Pages/DAO/Proposals/Util/ProposalHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const { address, withProvider, withSigner } = useWallet();

const showVote = ref(false);
const executing = ref(false);
const canExecute = ref(false);
const voting = ref(false);
const votingPower = ref(0n);
const voterState = ref(0);
const yeaPct = ref(50);

const editor = ref<HTMLElement | null>(null);
const endsWithDot = ref(false);

const yeaPctStr = computed(() => {
  if (endsWithDot.value) return `${yeaPct.value}.`;

  if (
    yeaPct.value === 0 &&
    !endsWithDot.value &&
    editor.value?.textContent !== "0"
  ) {
    return "";
  }

  return yeaPct.value.toString();
});

const canVote = computed(
  () =>
    votingPower.value > 0n &&
    !voting.value &&
    isVoteOpen.value &&
    voterState.value === 0
);

const voteButtonText = computed(() => {
  if (canVote.value) {
    return "submit";
  }

  if (voting.value) {
    return "voting";
  }

  if (!isVoteOpen.value) {
    return "voting-closed";
  }

  if (voterState.value !== 0) {
    return "voted";
  }

  return "not-enough-voting-power";
});

const votingPowerNumber = computed(() =>
  bigNumToNumber(votingPower.value, 18n)
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

const onYeaPct = (newVal: string) => {
  yeaPct.value = parseFloat(newVal);
};

const vote = withSigner((signer, address) =>
  tryNotifyLoading(voting, async () => {
    const voting = VotingCurve__factory.connect(CurveVotingAddress, signer);
    voterState.value = await voting.getVoterState(proposal.id, address);
    const pctBase = await voting.PCT_BASE().then((x) => x.toBigInt());

    // PCT_BASE = 10 ** 18; // 0% = 0; 1% = 10^16; 100% = 10^18
    const decimals = BigInt(Math.log10(Number(pctBase)));
    const yea = numToBigNumber(yeaPct.value / 100, decimals);
    const nay = pctBase - yea;

    const ps = [proposal.id, yea, nay, false] as const;
    const estimate = await voting.estimateGas.votePct(...ps);

    await voting
      .votePct(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    showVote.value = false;
  })
);

const execute = withSigner((signer) =>
  tryNotifyLoading(executing, async () => {
    const voting = VotingCurve__factory.connect(CurveVotingAddress, signer);

    const ps = [proposal.id] as const;
    const estimate = await voting.estimateGas.executeVote(...ps);

    await voting
      .executeVote(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    canExecute.value = await voting.canExecute(proposal.id);
  })
);

// Watches
const getWeb3Data = withProvider(async (provider, address) => {
  const voting = VotingCurve__factory.connect(CurveVotingAddress, provider);
  const veCrvAddress = await voting.token();
  voterState.value = await voting.getVoterState(proposal.id, address);

  const veCrv = VeCRV__factory.connect(veCrvAddress, provider);
  votingPower.value = await veCrv
    .balanceOfAt(address, proposal.block)
    .then((x) => x.toBigInt());
});

watch(showVote, async (show) => {
  if (!show) {
    return;
  }

  await tryNotify(getWeb3Data);
});

// Check if proposal can be executed.
watch(
  address,
  withProvider(async (provider) => {
    // Don't bother with non-executable votes.
    if (!executable.value) {
      return;
    }

    const voting = VotingCurve__factory.connect(CurveVotingAddress, provider);
    canExecute.value = await voting.canExecute(proposal.id);
  }),
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vote-content {
  width: 33vw;

  .vecrv {
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

<i18n lang="yaml" locale="en">
vote: Vote
vote-with-vecrv: Vote with veCRV
voting: Voting...
voting-closed: Voting closed
voted: You've already voted
description: Description
voting-power: Voting power
block: Block
yes: Yes
no: No
submit: Submit
not-enough-voting-power: Not enough veCRV voting power
execute: Execute
executing: Executing...
</i18n>
