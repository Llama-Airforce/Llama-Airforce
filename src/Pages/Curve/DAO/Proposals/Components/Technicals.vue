<template>
  <div class="technicals">
    <div class="technical">
      <div class="heading">{{ t("description") }}</div>
      <div class="description">{{ proposal.description }}</div>
    </div>

    <div class="technical">
      <div class="heading">
        {{ t("calldata") }}
        <i
          class="fas fa-chevron-up expander"
          :class="{ expanded }"
        ></i>
      </div>
      <div class="calldata">
        Call via agent: 0x40907540d8a6C65c637785e8f8B742ae6b0b9968
        <br />
        ├─ To: 0x2EF1Bc1961d3209E5743C91cd3fBfa0d08656bC3
        <br />
        ├─ Function: set_killed
        <br />
        └─ Inputs:
        <br />
        &nbsp;&nbsp;├─ _gauge: 0x16C2beE6f55dAB7F494dBa643fF52ef2D47FBA36
        <br />
        &nbsp;&nbsp;└─ _is_killed: True
      </div>
    </div>

    <div class="technical">
      <div class="heading">
        {{ t("voters") }} (4)
        <i
          class="fas fa-chevron-up expander"
          :class="{ expanded }"
        ></i>
      </div>

      <div class="voters">
        <div class="for">
          <div class="title">(2) {{ t("for") }}</div>

          <div class="vote">
            <div class="address">
              <a href="">0xAAA...AAA</a>
            </div>
            <div class="amount">1234</div>
          </div>

          <div class="vote">
            <div class="address">
              <a href="">0xBBB...BBB</a>
            </div>
            <div class="amount">1234</div>
          </div>
        </div>

        <div class="against">
          <div class="title">{{ t("against") }} (2)</div>

          <div class="vote">
            <div class="amount">1234</div>
            <div class="address">
              <a href="">0xAAA...AAA</a>
            </div>
          </div>

          <div class="vote">
            <div class="amount">1234</div>
            <div class="address">
              <a href="">0xBBB...BBB</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();

// Refs
const expanded = $ref(true);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.technicals {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;

  background-color: #18181b;
  border: solid 1px #35353b;

  > .technical {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    > .heading {
      display: flex;
      align-items: end;
      gap: 0.5rem;

      color: #a1a1aa;
      font-size: 1.125rem;
      margin-bottom: 0.25rem;
    }

    > .voters {
      display: grid;
      grid-template-columns: 1fr 1fr;
      row-gap: 0.25rem;
      gap: 2rem;

      > .for,
      > .against {
        > .title {
          display: flex;
          grid-row: 1 / span 2;
          font-weight: bold;
        }

        > .vote {
          display: grid;
          gap: 1rem;

          grid-template-columns: 1fr 1fr;

          > .amount,
          > .address {
            display: flex;
          }
        }
      }

      > .for {
        > .title {
          justify-content: end;
          color: rgb(126, 217, 87);
        }

        > .vote {
          > .amount {
            justify-content: end;
          }
        }
      }

      > .against {
        > .title {
          color: rgb(255, 87, 87);
        }

        > .vote {
          > .address {
            justify-content: end;
          }
        }
      }
    }

    .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
calldata: Calldata
voters: Voters
for: For
against: Against
</i18n>
