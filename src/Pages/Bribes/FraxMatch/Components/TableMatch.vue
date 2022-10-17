<template>
  <DataTable
    class="datatable-match"
    columns-header="1fr"
    columns-data="match-columns-data"
    :rows="matches"
    :columns="['', 'Deadline', 'Native', `Frax`, 'Total']"
    :sorting="true"
    :sorting-columns="['', 'deadline', 'native', 'frax', 'total']"
    :sorting-columns-enabled="['deadline', 'native', 'frax', 'total']"
    sorting-default-column="deadline"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #header-title>
      <div>All Rounds</div>
    </template>

    <template #row="props: { item: EpochFrax }">
      <Tooltip>
        <template #item>
          <div class="tooltip-match-columns-data">
            <div class="round-number">
              <a
                :href="voteLink(props.item)"
                target="_blank"
                class="vote-link"
              >
                <span v-if="isFinished(props.item)">{{
                  round(props.item)
                }}</span>
                <span v-else>
                  <Tooltip icon="far fa-clock"> Ongoing </Tooltip>
                </span>
              </a>
            </div>
            <div>
              {{ date(props.item) }}
            </div>
            <div class="number">
              <AsyncValue
                :value="native(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
            <div class="number">
              <AsyncValue
                :value="frax(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
            <div class="number">
              <AsyncValue
                :value="total(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
          </div>
        </template>

        <div class="bribes">
          <ul>
            <li
              v-for="(bribe, i) in bribes(props.item)"
              :key="i"
            >
              <div>{{ bribe.token }}</div>
              <div>
                <AsyncValue
                  :value="bribe.amountDollars"
                  :precision="2"
                  type="dollar"
                />
              </div>
              <div>
                <AsyncValue
                  :value="bribe.amount"
                  :precision="2"
                  :show-symbol="false"
                  type="dollar"
                />
              </div>
            </li>
          </ul>
        </div>
      </Tooltip>
    </template>
  </DataTable>
</template>

<script
  setup
  lang="ts"
>
import { $ref, $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import Tooltip from "@/Framework/Tooltip.vue";
import { SortOrder } from "@/Framework/SortOrder";
import { orderBy } from "lodash";
import { getDate, getDateRaw, getLink } from "@/Pages/Bribes/Util/EpochHelper";
import type { Proposal } from "@/Pages/Bribes/Models/Epoch";
import type { EpochId } from "@/Pages/Bribes/Models/EpochId";
import { Bribe } from "@/Pages/Bribes/Models/Bribe";

type EpochFrax = EpochId &
  Proposal & {
    round: number;
    native: number;
    frax: number;
  };

const rounds: EpochFrax[] = [
  {
    platform: "votium",
    protocol: "cvx-crv",
    round: 1,
    proposal: "none",
    end: 0,
    native: 1,
    frax: 1,
  },
  {
    platform: "votium",
    protocol: "cvx-crv",
    round: 2,
    proposal: "none",
    end: 0,
    native: 5,
    frax: 4,
  },
  {
    platform: "votium",
    protocol: "cvx-crv",
    round: 3,
    proposal: "none",
    end: 0,
    native: 3,
    frax: 1.5,
  },
  {
    platform: "votium",
    protocol: "cvx-crv",
    round: 4,
    proposal: "none",
    end: 0,
    native: 7,
    frax: 4,
  },
  {
    platform: "votium",
    protocol: "cvx-crv",
    round: 5,
    proposal: "none",
    end: 0,
    native: 10,
    frax: 8.5,
  },
];

// Refs
let sortColumn: "deadline" | "native" | "frax" | "total" = $ref("deadline");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const matches = $computed((): EpochFrax[] => {
  return orderBy(
    rounds,
    (round: EpochFrax) => {
      switch (sortColumn) {
        case "deadline":
          return round.round;
        case "native":
          return native(round);
        case "frax":
          return frax(round);
        case "total":
          return total(round);
        default:
          return round.round;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Methods
const round = (epoch: EpochFrax): number => {
  return epoch.round;
};

const voteLink = (epoch: EpochFrax): string => {
  return getLink(epoch, epoch.proposal);
};

const native = (epoch: EpochFrax): number => {
  return epoch.native;
};

const frax = (epoch: EpochFrax): number => {
  return epoch.frax;
};

const total = (epoch: EpochFrax): number => {
  return native(epoch) + frax(epoch);
};

const date = (epoch: EpochFrax): string => {
  return getDate(epoch);
};

const isFinished = (epoch: EpochFrax): boolean => {
  return new Date() > getDateRaw(epoch);
};

const bribes = (epoch: EpochFrax): Bribe[] => {
  if (!epoch) {
    return [];
  }

  return [
    {
      pool: "",
      token: "FXS",
      amount: 5,
      amountDollars: 10,
    },
  ];
};

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "deadline" | "native" | "frax" | "total";
  sortOrder = order;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.datatable-match {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.match-columns-data) {
    display: grid;
    grid-template-columns: 1.5rem 1fr 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }

  ::v-deep(.tooltip) {
    grid-column: 1 / span 5;
    display: flex;
    height: 100%;
    align-items: center;

    > div {
      display: flex;
      flex-grow: 1;
      height: 100%;
      align-items: center;

      > div {
        display: flex;
        flex-grow: 1;
        height: 100%;
        align-items: center;

        > .tooltip-match-columns-data {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1.5rem 1fr 1fr 1fr 1fr;
          grid-column-gap: 1rem;

          // Right adjust number columns.
          div:nth-child(3),
          div:nth-child(4),
          div:nth-child(5) {
            justify-content: end;
          }
        }
      }
    }

    > .popper {
      height: auto;

      > .bribes {
        > ul {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
          list-style-type: none;

          > li {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 1rem;

            > div {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
