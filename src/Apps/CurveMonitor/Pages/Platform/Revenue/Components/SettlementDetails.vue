<script setup lang="ts">
import type { CowSwapSettlement } from "@CM/Services/revenue";
import { useQuerySolverCompetition } from "@CM/Services/solver/queries";

const { settlement } = defineProps<{
  settlement: CowSwapSettlement;
}>();

// Data
const { data: competition, isPending: isLoading } = useQuerySolverCompetition(
  toRef(() => settlement.txHash)
);

const json = computed(() => {
  if (!competition.value) {
    return "no data";
  }

  return JSON.stringify(
    competition.value,
    (_, v: unknown) => (typeof v === "bigint" ? v.toString() : v),
    2
  );
});

const solutions = computed(() => {
  if (!competition.value) {
    return [];
  }

  return competition.value.solutions.orderBy((x) => x.ranking, "asc");
});

function linkAddress(addr: string): string {
  return `https://etherscan.io/address/${addr}`;
}

async function clipboard(addr: string) {
  await navigator.clipboard.writeText(addr);
}

async function clipboardJson() {
  await navigator.clipboard.writeText(json.value);
}

function rankClass(ranking: number) {
  switch (ranking) {
    case 1:
      return "gold";
    case 2:
      return "silver";
    case 3:
      return "bronze";
    default:
      return "";
  }
}

// Fullscreen
const fullscreen = ref(false);
const cardJson = useTemplateRef("cardJson");
</script>

<template>
  <Card class="settlement-details">
    <div class="settlement-details-body">
      <div class="info col">
        <KPI
          label="Auction Start Block"
          :has-value="!isLoading"
        >
          {{ competition?.auctionStartBlock ?? 0 }}
        </KPI>

        <KPI
          label="Solvers"
          :has-value="!isLoading"
        >
          {{ competition?.solutions?.length ?? 0 }}
        </KPI>

        <KPI
          label="Orders"
          :has-value="!isLoading"
        >
          {{ competition?.orders?.length ?? 0 }}
        </KPI>

        <Card
          ref="cardJson"
          class="card-json col"
          title="Json"
        >
          <template #actions>
            <div class="buttons">
              <Button @click="clipboardJson()">
                <LucideLink />
              </Button>

              <Button @click="fullscreen = !fullscreen">
                <LucideMaximize />

                <ModalFullscreen
                  :target="cardJson?.$el"
                  :show="fullscreen"
                  @close="fullscreen = false"
                />
              </Button>
            </div>
          </template>

          <div class="font-mono json">
            {{ json }}
          </div>
        </Card>
      </div>

      <Card
        class="col"
        title="Solvers"
      >
        <Table
          class="solvers-table col"
          :rows="solutions"
        >
          <template #row="{ item: { solver, solverAddress, ranking, score } }">
            <div
              class="trophy"
              :class="rankClass(ranking)"
            >
              <LucideTrophy v-if="ranking <= 3" />
              <span v-else>{{ ranking }}</span>
            </div>

            <div>
              <a
                class="font-mono"
                target="_blank"
                :href="linkAddress(solverAddress)"
              >
                {{ solver }}
              </a>
            </div>

            <div>
              {{ score }}
            </div>

            <div>
              <Button @click="clipboard(solverAddress)">
                <LucideLink />
              </Button>
            </div>
          </template>
        </Table>
      </Card>
    </div>
  </Card>
</template>

<style scoped>
.card-json {
  .buttons {
    display: flex;
    gap: 1rem;
  }

  .json {
    word-break: break-all;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: pre-wrap;
    width: 100%;
  }

  &.fullscreen {
    .json {
      max-height: unset;
    }
  }
}

.settlement-details-body {
  padding: var(--dashboard-gap);
  background-color: var(--c-lvl2);

  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--dashboard-gap);

  .col {
    display: flex;
    flex-direction: column;

    > * {
      flex-grow: 0;
    }
  }

  > .info {
    gap: var(--dashboard-gap);
  }

  .solvers-table {
    --columns-data: 25px minmax(24ch, 1fr) 2fr auto;

    button {
      background: transparent;

      &:hover,
      &:active {
        background: transparent;
      }
    }

    .trophy {
      display: flex;
      place-content: center;
    }

    .gold {
      color: #ffd700;
    }

    .silver {
      color: #c0c0c0;
    }

    .bronze {
      color: #cd7f32;
    }
  }
}
</style>
