<template>
  <div class="sockets">
    <div class="connect">
      <InputText v-model="url"></InputText>

      <Button
        value="Ping"
        :disabled="!isConnected"
        @click="ping"
      >
      </Button>

      <Button
        v-if="!isConnected"
        :value="connecting ? 'Connecting' : 'Connect'"
        :disabled="connecting"
        @click="connect"
      ></Button>

      <Button
        v-else
        value="Disconnect"
        @click="disconnect"
      ></Button>
    </div>

    <div
      class="output font-mono"
      v-html="output"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { type Socket } from "socket.io-client";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import SocketIOService from "@/Services/Socket/SocketIOService";

type ClientToServerEvents = {
  Ping: () => void;
};

type ServerToClientEvents = {
  Pong: () => void;
};

type SocketTest = Socket<ServerToClientEvents, ClientToServerEvents>;

class TestSocketService extends SocketIOService<
  ServerToClientEvents,
  ClientToServerEvents,
  SocketTest
> {
  ping() {
    return this.emitAndListen("Ping", "Pong");
  }
}

const output = ref("");
const url = ref("wss://api.curvemonitor.com");
const { socket, connecting, isConnected, connect, disconnect } =
  useSocketIO<SocketTest>({
    url: () => url.value,
    connectOnMount: false,
  });

const service = new TestSocketService(socket);

async function ping() {
  await service.ping();

  const timestamp = new Date(Date.now());
  const formattedTime = timestamp.toLocaleTimeString();

  output.value = `Pong received at ${formattedTime}<br />` + output.value;
}

watch(isConnected, (newIsConnected) => {
  output.value =
    (newIsConnected
      ? `Connected to ${url.value}<br />`
      : "Disconnected<br />") + output.value;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("sockets");

.sockets {
  display: grid;
  grid-template-rows: auto auto;

  .connect {
    grid-row: 1;

    display: flex;
    gap: 1rem;
  }

  .output {
    grid-row: 2;

    max-height: 80svh;
    overflow-y: auto;
    overflow-wrap: anywhere;
  }
}
</style>
