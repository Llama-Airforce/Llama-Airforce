<template>
  <div class="ve-funder">
    <div class="dashboard">
      <div class="explanation">
        <Card>
          <div class="step-one">
            <strong>veFunder</strong> process:
            <ol>
              <li>
                Create a fundraising gauge contract that allows a receiver to
                get a certain amount of CRV.
              </li>
              <li>
                Request a vote to add the gauge to the controller.<br />When
                passed, the newly created gauge can be voted on during gauge
                votes and can then receive gauge emissions.
              </li>
            </ol>
          </div>

          <div class="step-two">
            <strong>Gauge vote requirements:</strong>
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
              <li>
                You must have a minimum of 2,500 veCRV to create this vote
              </li>
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

<script
  setup
  lang="ts"
>
import { $ref } from "vue/macros";
import Card from "@/Framework/Card.vue";
import DeployGauge from "@/Pages/Curve/VeFunder/Components/DeployGauge.vue";
import GaugeVote from "@/Pages/Curve/VeFunder/Components/GaugeVote.vue";

// Refs
let gauge = $ref("");

// Events
const onGauge = (newGauge: string): void => {
  gauge = newGauge;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.ve-funder {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    > .explanation {
      ::v-deep(.card-body) {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        font-size: 0.875rem;
        font-weight: lighter;
      }
    }

    > .forms {
      display: flex;
      gap: 1.5rem;
    }
  }
}
</style>
