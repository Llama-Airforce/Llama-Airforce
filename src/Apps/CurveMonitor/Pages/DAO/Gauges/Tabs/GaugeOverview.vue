<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import type { Gauge } from "@curvefi/prices-api/gauge";
import TableDeployment from "../Tables/TableDeployment.vue";
import ChartWeightHistory from "../Charts/ChartWeightHistory.vue";

const { gauge } = defineProps<{
  gauge: Gauge | undefined;
}>();

const gaugeAddress = computed(() => gauge?.address);

function clean(name: string): string {
  if (isAddress(name, { strict: false })) {
    return addressShort(name);
  }

  return (name as unknown as string)
    .replace("Curve.fi", "")
    .replace("Gauge Deposit", "")
    .trim();
}

function scanUrl(chain: Chain) {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (chain) {
    case "arbitrum":
      return "arbiscan.io";
    case "ethereum":
      return "etherscan.io";
    default:
      return "etherscan.io";
  }
}
</script>

<template>
  <Card
    v-if="gauge?.killed"
    class="killed border-flash"
  >
    This gauge has been killed!
  </Card>

  <div class="dashboard-grid">
    <KPI
      style="grid-area: title"
      label="Gauge"
      :has-value="!!gauge"
    >
      <a
        v-if="gauge"
        class="font-mono"
        target="_blank"
        :href="`https://etherscan.io/address/${gauge.address}`"
        @click.stop
      >
        {{ clean(gauge.name ?? gauge.address) }}
      </a>

      <span v-else> ?</span>
    </KPI>

    <KPI
      style="grid-area: underlying"
      label="Market / Pool"
      :has-value="!!gauge"
    >
      <a
        v-if="!!gauge?.pool"
        class="font-mono"
        target="_blank"
        :href="`https://${scanUrl(gauge.pool.chain)}/address/${
          gauge.pool.address
        }`"
        @click.stop
      >
        {{ clean(gauge.pool.name) }}
      </a>

      <span v-else-if="!!gauge?.market">
        {{ clean(gauge.market.name) }}
      </span>

      <span v-else>No underlying market or pool</span>
    </KPI>

    <KPI
      style="grid-area: lp-token"
      label="LP Token"
      :has-value="!!gauge"
    >
      <a
        v-if="!!gauge?.lpToken && !!gauge?.pool"
        class="font-mono"
        target="_blank"
        :href="`https://${scanUrl(gauge.pool.chain)}/address/${gauge.lpToken}`"
        @click.stop
      >
        {{ addressShort(gauge.lpToken) }}
      </a>

      <span v-else>No LP token</span>
    </KPI>

    <KPI
      style="grid-area: tokens"
      label="Tokens"
      :has-value="!!gauge"
    >
      <div
        v-if="gauge?.tokens && gauge.tokens.length > 0"
        class="tokens"
      >
        <TokenIcon
          v-for="token of gauge.tokens"
          :key="token.address"
          clickable
          class="token"
          :address="token.address"
        />
      </div>
      <span v-else>No tokens</span>
    </KPI>

    <KPI
      style="grid-area: weight"
      label="Weight"
      :has-value="!!gauge"
    >
      <AsyncValue :value="Number(gauge?.weight ?? 0) / 10 ** 18" />
    </KPI>

    <KPI
      style="grid-area: emissions"
      label="Emissions"
      :has-value="!!gauge"
    >
      <AsyncValue :value="gauge?.emissions ?? 0" />
    </KPI>

    <KPI
      style="grid-area: date"
      label="Creation Date"
      :has-value="!!gauge"
    >
      <a
        v-if="!!gauge"
        class="font-mono"
        target="_blank"
        :href="`https://etherscan.io/tx/${gauge.creationTx}`"
        @click.stop
      >
        {{ gauge.creationDate.toLocaleDateString() }}
      </a>
    </KPI>

    <TableDeployment
      style="grid-area: deployment"
      :gauge-address
    />

    <ChartWeightHistory
      style="grid-area: weight-chart"
      :gauge-address
    />
  </div>
</template>

<style scoped>
.killed {
  margin-top: var(--dashboard-gap);
  --flash-color: var(--c-red);
}

.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: repeat(4, 1fr);
  grid-template-areas:
    "title date underlying underlying"
    "weight emissions tokens lp-token"
    "deployment deployment weight-chart weight-chart";

  @media only screen and (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "title date"
      "weight emissions"
      "underlying underlying"
      "tokens lp-token"
      "deployment deployment"
      "weight-chart weight-chart";
  }

  .tokens {
    display: flex;
    align-items: center;
    gap: 1ch;

    .token {
      max-width: 26px;
      flex-shrink: 1;
      width: 100%;
    }
  }
}
</style>
