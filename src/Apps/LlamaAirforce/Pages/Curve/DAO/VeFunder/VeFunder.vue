<template>
  <div class="ve-funder">
    <div class="dashboard">
      <div class="explanation">
        <Card>
          <div class="step-one">
            <span v-html="t('process')"></span>
            <ol>
              <li>{{ t("process-1") }}</li>
              <li v-html="t('process-2')"></li>
            </ol>
          </div>

          <div class="step-two">
            <span v-html="t('requirements')"></span>
            <ol>
              <li>
                {{ t("requirements-1a") }}
                <a
                  href="https://gov.curve.fi/"
                  target="_blank"
                >
                  {{ t("requirements-1b") }}
                </a>
              </li>
              <li>{{ t("requirements-2") }}</li>
            </ol>
          </div>
        </Card>
      </div>

      <div class="forms">
        <DeployGauge @gauge="onGauge"></DeployGauge>
        <GaugeVote :gauge="gauge"></GaugeVote>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { Card } from "@/Framework";
import DeployGauge from "@LAF/Pages/Curve/DAO/VeFunder/Components/DeployGauge.vue";
import GaugeVote from "@LAF/Pages/Curve/DAO/VeFunder/Components/GaugeVote.vue";

const { t } = useI18n();

// Refs
const gauge = ref("");

// Events
const onGauge = (newGauge: string): void => {
  gauge.value = newGauge;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("ve-funder");

.ve-funder {
  .dashboard {
    > .explanation {
      ::v-deep(.card-body) {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        font-size: 0.875rem;
        font-weight: var(--font-weight);
      }
    }

    > .forms {
      display: flex;
      gap: var(--dashboard-gap);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
process: "<strong>veFunder</strong> process:"

process-1: Create a fundraising gauge contract that allows a receiver to get a certain amount of CRV.
process-2: Request a vote to add the gauge to the controller.<br />When
  passed, the newly created gauge can be voted on during gauge
  votes and can then receive gauge emissions.

requirements: "<strong>Gauge vote requirements:</strong>"

requirements-1a: New gauge votes must have a vote on the governance forum
requirements-1b: at this address
requirements-2: You must have a minimum of 2,500 veCRV to create this vote
</i18n>
