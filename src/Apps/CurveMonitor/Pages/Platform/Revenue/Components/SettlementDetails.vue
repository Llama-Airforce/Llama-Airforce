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
          :class="{ fullscreen }"
        >
          <template #actions>
            <div class="buttons">
              <Button
                icon="fas fa-link"
                @click="clipboardJson()"
              ></Button>

              <Button @click="fullscreen = !fullscreen">
                <i class="fas fa-expand"></i>

                <ModalFullscreen
                  :target="cardJson?.$el"
                  :show="fullscreen"
                  @close="fullscreen = false"
                >
                </ModalFullscreen>
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
          <template
            #row="{
              item: { solver, solverAddress, ranking, score },
            }: {
              item: Row,
            }"
          >
            <div
              class="trophy"
              :class="rankClass(ranking)"
            >
              <i
                v-if="ranking <= 3"
                class="fas fa-trophy"
              ></i>
              <span v-else>{{ ranking }}</span>
            </div>

            <div>
              <a
                class="font-mono"
                :href="linkAddress(solverAddress)"
                target="_blank"
              >
                {{ solver }}
              </a>
            </div>

            <div>
              {{ score }}
            </div>

            <div>
              <Button
                icon="fas fa-link"
                @click="clipboard(solverAddress)"
              ></Button>
            </div>
          </template>
        </Table>
      </Card>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { type CowSwapSettlement } from "@CM/Services/Revenue";
import { type SolverCompetition } from "@CM/Services/Solver";
import { useQuerySolverCompetition } from "@CM/Services/Solver/Queries";

type Row = SolverCompetition["solutions"][number];

// Props
interface Props {
  settlement: CowSwapSettlement;
}

const { settlement } = defineProps<Props>();

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
const cardJson = ref<ComponentPublicInstance | undefined>(undefined);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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
