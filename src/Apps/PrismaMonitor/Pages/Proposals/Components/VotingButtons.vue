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
    :show="showVote"
    @close="showVote = false"
  >
    <Card
      :title="t('vote-with-veprisma')"
      class="vote-content"
    >
      <div class="veprisma">
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
              vePRISMA
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
            <span>{{ proposal.metadata?.description || "" }}</span>
          </div>
        </div>

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
import { PrismaLocker__factory, VotingPrisma__factory } from "@/Contracts";
import { useWallet } from "@/Wallet";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";
import { getStatus } from "@PM/Pages/Proposals/Util/ProposalHelper";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const { address, withProvider, withProviderReturn, withSigner } = useWallet();

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
const vote = withSigner((signer, address) =>
  tryNotifyLoading(voting, async () => {
    const voting = VotingPrisma__factory.connect(PrismaVotingAddress, signer);
    const ps = [address, proposal.id, votingPower.value] as const;
    const estimate = await voting.estimateGas.voteForProposal(...ps);

    await voting
      .voteForProposal(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    showVote.value = false;
  })
);

const execute = withSigner((signer) =>
  tryNotifyLoading(executing, async () => {
    const voting = VotingPrisma__factory.connect(PrismaVotingAddress, signer);

    const ps = [proposal.id] as const;
    const estimate = await voting.estimateGas.executeProposal(...ps);

    await voting
      .executeProposal(...ps, {
        gasLimit: estimate.mul(125).div(100),
      })
      .then((x) => x.wait());

    canExecute.value = await canExecuteProposal();
  })
);

// Watches
const getWeb3Data = withProvider(async (provider, address) => {
  const voting = VotingPrisma__factory.connect(PrismaVotingAddress, provider);
  const lockerAddress = await voting.tokenLocker();

  voted.value = await voting
    .accountVoteWeights(address, proposal.id)
    .then((x) => x.gt(0));

  const vePrisma = PrismaLocker__factory.connect(lockerAddress, provider);
  const week = Math.floor((proposal.start - 1691625600) / 604800) - 1;
  votingPower.value = await vePrisma
    .getAccountWeightAt(address, week)
    .then((x) => x.toBigInt());
});

watch(showVote, async (show) => {
  if (!show) {
    return;
  }

  await tryNotify(getWeb3Data);
});

const canExecuteProposal = withProviderReturn(
  async (provider) => {
    // Don't bother with non-executable votes.
    if (!executable.value) {
      return false;
    }

    const voting = VotingPrisma__factory.connect(PrismaVotingAddress, provider);
    const MAX_TIME_TO_EXECUTION = await voting
      .MAX_TIME_TO_EXECUTION()
      .then((x) => Number(x.toBigInt()));

    const passed = proposal.executeAfter !== 0;
    const minTimeToExecution =
      proposal.executeAfter < new Date().getTime() / 1000;
    const maxTimeToExecution =
      proposal.executeAfter + MAX_TIME_TO_EXECUTION >
      new Date().getTime() / 1000;

    return passed && minTimeToExecution && maxTimeToExecution;
  },
  () => false
);

// Check if proposal can be executed.
watch(
  address,
  async () => {
    canExecute.value = await canExecuteProposal();
  },
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
  min-width: 33vw;

  .veprisma {
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
