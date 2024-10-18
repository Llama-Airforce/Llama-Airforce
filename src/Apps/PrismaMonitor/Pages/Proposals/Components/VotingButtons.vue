<script setup lang="ts">
import { mainnet } from "viem/chains";
import { abi as abiLocker } from "@/ABI/Prisma/PrismaLocker";
import { abi as abiVoting } from "@/ABI/Prisma/VotingPrisma";
import { useWallet } from "@/Wallet";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import { getStatus } from "@PM/Pages/Proposals/Util/ProposalHelper";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
}>();

// Refs
const { address } = useWallet();

const showVote = ref(false);
const executing = ref(false);
const canExecute = ref(false);
const voting = ref(false);
const votingPower = ref(0n);
const voted = ref(false);

const canVote = computed(
  () =>
    votingPower.value > 0n && !voting.value && isVoteOpen.value && !voted.value
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

  if (voted.value) {
    return "voted";
  }

  return "not-enough-voting-power";
});

const votingPowerNumber = computed(() => Number(votingPower.value));
const isVoteOpen = computed(() => getStatus(proposal) === "active");
const executable = computed(() => getStatus(proposal) === "passed");

// Methods
const config = useConfig();
async function vote() {
  await tryNotifyLoading(voting, async () => {
    if (!address.value) {
      return;
    }

    const hash = await writeContract(config, {
      abi: abiVoting,
      address: PrismaVotingAddress,
      functionName: "voteForProposal",
      args: [address.value, BigInt(proposal.id), votingPower.value],
    });

    await waitForTransactionReceipt(config, { hash });

    showVote.value = false;
  });
}

async function execute() {
  await tryNotifyLoading(executing, async () => {
    const hash = await writeContract(config, {
      abi: abiVoting,
      address: PrismaVotingAddress,
      functionName: "executeProposal",
      args: [BigInt(proposal.id)],
    });

    await waitForTransactionReceipt(config, { hash });

    showVote.value = false;

    canExecute.value = await canExecuteProposal();
  });
}

// Watches
async function getWeb3Data() {
  if (!address.value) {
    return;
  }

  const lockerAddress = await readContract(config, {
    abi: abiVoting,
    address: PrismaVotingAddress,
    functionName: "tokenLocker",
  });

  voted.value = await readContract(config, {
    abi: abiVoting,
    address: PrismaVotingAddress,
    functionName: "accountVoteWeights",
    args: [address.value, BigInt(proposal.id)],
  }).then((x) => x > 0n);

  const week = Math.floor((proposal.start - 1691625600) / 604800) - 1;
  votingPower.value = await readContract(config, {
    abi: abiLocker,
    address: lockerAddress,
    functionName: "getAccountWeightAt",
    args: [address.value, BigInt(week)],
  });
}

whenever(showVote, async () => {
  await tryNotify(getWeb3Data);
});

async function canExecuteProposal() {
  // Don't bother with non-executable votes.
  if (!executable.value) {
    return false;
  }

  const MAX_TIME_TO_EXECUTION = await readContract(config, {
    abi: abiVoting,
    address: PrismaVotingAddress,
    functionName: "MAX_TIME_TO_EXECUTION",
  });

  const passed = proposal.executeAfter !== 0;
  const minTimeToExecution =
    proposal.executeAfter < new Date().getTime() / 1000;
  const maxTimeToExecution =
    proposal.executeAfter + Number(MAX_TIME_TO_EXECUTION) >
    new Date().getTime() / 1000;

  return passed && minTimeToExecution && maxTimeToExecution;
}

// Check if proposal can be executed.
watch(
  address,
  async () => {
    canExecute.value = await canExecuteProposal();
  },
  { immediate: true }
);
</script>

<template>
  <div class="buttons">
    <Button
      class="primary"
      @click="showVote = true"
    >
      {{ t("vote") }}
    </Button>

    <Button
      v-if="executable"
      class="primary"
      :disabled="!canExecute || executing"
      @click="execute"
    >
      {{ t(executing ? "executing" : "execute") }}
    </Button>
  </div>

  <Modal
    :show="showVote"
    @close="showVote = false"
  >
    <Card
      class="vote-content"
      :title="t('vote-with-veprisma')"
    >
      <div class="veprisma">
        <div class="info">
          <div class="kpis">
            <KPI
              has-value
              :label="t('voting-power')"
            >
              <AsyncValue
                show-zero
                type="dollar"
                :value="votingPowerNumber"
                :precision="2"
                :show-symbol="false"
              />
              vePRISMA
            </KPI>

            <KPI
              has-value
              :label="t('block')"
              :value="proposal.block"
            >
            </KPI>
          </div>

          <div class="description">
            <span class="title">{{ t("description") }}: </span>
            <span>{{ proposal.metadata?.description || "" }}</span>
          </div>
        </div>

        <Button
          class="submit primary"
          :disabled="!canVote"
          :chain-id="mainnet.id"
          @click="vote"
        >
          {{ t(voteButtonText) }}
        </Button>
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
    width: 90vw;
  }

  .veprisma {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    > .info {
      width: 100%;

      display: flex;
      flex-direction: column;
      gap: 2rem;
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
vote-with-veprisma: Vote with vePRISMA
voting: Voting...
voting-closed: Voting closed
voted: You've already voted
description: Description
voting-power: Voting power
block: Block
submit: Submit
not-enough-voting-power: Not enough vePRISMA voting power
execute: Execute
executing: Executing...
</i18n>
