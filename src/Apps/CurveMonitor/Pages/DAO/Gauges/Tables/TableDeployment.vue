<script setup lang="ts">
import { useQueryDeployment } from "@CM/Services/Gauge/Queries";

const { gaugeAddress } = defineProps<{
  gaugeAddress: string | undefined;
}>();

const { isFetching: loading, data } = useQueryDeployment(
  toRef(() => gaugeAddress)
);

const calldata = computed(() => {
  if (!data.value?.calldataDecoded) {
    return null;
  }

  return data.value.calldataDecoded
    .replace(/(?:\r\n|\r|\n)/g, "<br>")
    .replace("/\u251c/g", "├")
    .replace("/\u2500/g", "─")
    .replace(/0x[a-fA-F0-9]{40}/g, (match) =>
      /[A-F]/g.test(match) && isAddress(match)
        ? `<a target='_blank' href='https://etherscan.io/address/${match}'>${match}</a>`
        : match
    );
});
</script>

<template>
  <Card
    title="Deployment"
    :loading
  >
    <Table v-if="data">
      <TableRow>
        <div>Date</div>
        <div>
          {{ new Date(data.timestamp * 1000).toLocaleDateString() }}
        </div>
      </TableRow>

      <TableRow>
        <div>From</div>
        <div>
          <a
            class="font-mono"
            target="_blank"
            :href="`https://etherscan.io/address/${data.addressFrom}`"
            @click.stop
          >
            {{ data.addressFrom }}
          </a>
        </div>
      </TableRow>

      <TableRow v-if="data.addressTo">
        <div>To</div>
        <div>
          <a
            class="font-mono trim"
            target="_blank"
            :href="`https://etherscan.io/address/${data.addressTo}`"
            @click.stop
          >
            {{ data.addressTo }}
          </a>
        </div>
      </TableRow>
    </Table>

    <div
      v-if="calldata"
      class="calldata font-mono"
      v-html="calldata"
    ></div>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(4rem, 1fr) auto;
}

.calldata {
  margin-top: 1rem;
  max-height: 10rem;
  overflow-y: auto;
}
</style>
