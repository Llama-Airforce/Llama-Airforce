<script setup lang="ts">
import DeployGauge from "@CM/Pages/DAO/VeFunder/Components/DeployGauge.vue";
import GaugeVote from "@CM/Pages/DAO/VeFunder/Components/GaugeVote.vue";

// Refs
const gauge = ref("");

// Events
const onGauge = (newGauge: string): void => {
  gauge.value = newGauge;
};
</script>

<template>
  <div class="ve-funder">
    <div class="explanation">
      <Card>
        <div class="step-one">
          <span><strong>veFunder</strong> process:</span>
          <ol>
            <li>
              Create a fundraising gauge contract that allows a receiver to get
              a certain amount of CRV.
            </li>

            <li>
              Request a vote to add the gauge to the controller.<br />When
              passed, the newly created gauge can be voted on during gauge votes
              and can then receive gauge emissions.
            </li>
          </ol>
        </div>

        <div class="step-two">
          <span><strong>Gauge vote requirements:</strong></span>
          <ol>
            <li>
              New gauge votes must have a vote on the governance forum
              <a
                href="https://gov.curve.fi/"
                target="_blank"
              >
                at this address
              </a>
            </li>

            <li>You must have a minimum of 2,500 veCRV to create this vote</li>
          </ol>
        </div>
      </Card>
    </div>

    <div class="forms">
      <DeployGauge @gauge="onGauge"></DeployGauge>
      <GaugeVote :gauge="gauge"></GaugeVote>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("ve-funder");

.ve-funder {
  max-width: calc(1920px - 18.125rem);

  > .explanation {
    :deep(.card-body) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  > .forms {
    display: flex;
    gap: var(--dashboard-gap);

    @media only screen and (max-width: 1280px) {
      flex-direction: column;
    }
  }
}
</style>
