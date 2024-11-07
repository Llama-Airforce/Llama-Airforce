<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { useQueryUserProposalVotes } from "@CM/Services/Proposal/Queries";

const { user } = defineProps<{ user: string | undefined }>();

const { isFetching: loading, data } = useQueryUserProposalVotes(
  toRef(() => user)
);

const columns = [
  { id: "timestamp", label: "Time", sort: true } as const,
  { id: "proposal", label: "Proposal", sort: false } as const,
  { id: "weight", label: "Weight", sort: true, align: "end" } as const,
  { id: "supports", label: "Supports", sort: false, align: "center" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("timestamp");

const rows = computed(() =>
  data.value
    .flatMap((x) => x.votes.map((vote) => ({ ...vote, proposal: x.proposal })))
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "timestamp":
          return x.proposal.timestamp;
        case "weight":
          return Number(x.weight) / 10 ** 18;
      }
    }, sorting.value.order)
    .take(100)
);

const router = useRouter();

async function onSelect({ proposal }: (typeof rows.value)[number]) {
  await router.push({
    name: "proposal",
    params: {
      proposalType: proposal.type,
      proposalId: proposal.id,
    },
  });
}
</script>

<template>
  <Card
    title="Proposal Votes"
    :loading
  >
    <Table
      v-if="rows.length > 0"
      :rows
      :columns
      :sorting
      @sort-column="onSort"
      @select="onSelect"
    >
      <template #row="{ item: { proposal, weight, supports, txHash } }">
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/tx/${txHash}`"
            @click.stop
          >
            {{ new Date(proposal.timestamp * 1000).toLocaleDateString() }}
          </a>
        </div>

        <div
          class="title"
          :class="{ 'no-title': !proposal.metadata }"
        >
          <span class="id">
            {{ proposal.id }}
          </span>

          <div class="metadata">
            {{ proposal.metadata || "< No Title >" }}
          </div>
        </div>

        <div class="end">
          <AsyncValue :value="Math.round(Number(weight) / 10 ** 18)" />
        </div>

        <div
          class="supports center"
          :class="{ yes: supports }"
        >
          <LucideCheck v-if="supports" />
          <LucideX v-else />
        </div>
      </template>

      <!-- Empty for expander arrow and pointer on hover -->
      <template #row-details> &nbsp; </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(user)} has not voted for any proposal yet`"
    />
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(7rem, 0.1fr) minmax(7rem, 1fr) minmax(7rem, 0.1fr)
    minmax(7rem, 0.1fr) 1rem;

  .supports {
    &.yes {
      color: var(--c-green);
    }

    &:not(&.yes) {
      color: var(--c-red);
    }
  }

  .title {
    display: flex;
    gap: 1ch;

    &.no-title {
      color: var(--c-lvl6);
    }

    > .metadata {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > .id {
      display: flex;
      align-items: center;
      gap: 1ch;
      color: var(--c-lvl6);
    }
  }
}
</style>
