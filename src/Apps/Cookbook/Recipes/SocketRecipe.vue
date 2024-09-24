<script setup lang="ts">
import { type Socket } from "socket.io-client";
import { type Subscription } from "rxjs";
import { useSocketIO } from "@/Framework/Composables/UseSocketIO";
import { emitAndListen, createObservable } from "@/Services/Socket";

type ClientToServerEvents = {
  Ping: () => void;
  getSandwichLabelOccurrences: () => void;
};

type ServerToClientEvents = {
  Pong: () => void;
  sandwichLabelOccurrences: (labelsOccurrence: never[]) => void;
};

type SocketTest = Socket<ServerToClientEvents, ClientToServerEvents>;

type SocketObservable<T extends keyof ServerToClientEvents> = ReturnType<
  typeof createObservable<ServerToClientEvents, T>
>;

class TestSocketService {
  public readonly labels$: SocketObservable<"sandwichLabelOccurrences">;

  constructor(private socket: SocketTest) {
    this.labels$ = createObservable(socket, "sandwichLabelOccurrences");
  }

  ping() {
    return emitAndListen(this.socket, "Ping", "Pong");
  }

  getLabels() {
    this.socket.emit("getSandwichLabelOccurrences");
  }
}

const output = ref("");
const url = ref("wss://api.curvemonitor.com/main");
const { socket, connecting, isConnected, connect, disconnect } =
  useSocketIO<SocketTest>({
    url: () => url.value,
    connectOnMount: false,
  });

const service = computed(() =>
  socket.value ? new TestSocketService(socket.value) : null
);

async function ping() {
  if (!service.value) {
    output.value += "Not connected, cannot ping<br />" + output.value;
    return;
  }

  await service.value.ping();

  const timestamp = new Date(Date.now());
  const formattedTime = timestamp.toLocaleTimeString();

  output.value =
    `Pong received with emitAndListen at ${formattedTime}<br />` + output.value;
}

function getLabels() {
  if (!service.value) {
    output.value += "Not connected, cannot ping<br />" + output.value;
    return;
  }

  service.value.getLabels();
}

// Labels subscription.
let labelsSub: Subscription | null = null;
whenever(service, (newService) => {
  labelsSub?.unsubscribe();
  labelsSub = newService.labels$.subscribe((labels) => {
    const timestamp = new Date(Date.now());
    const formattedTime = timestamp.toLocaleTimeString();

    output.value =
      `Labels received with observable at ${formattedTime}: ${JSON.stringify(
        labels
      )}<br />` + output.value;
  });
});

watch(isConnected, (isConnected) => {
  output.value =
    (isConnected ? `Connected to ${url.value}<br />` : "Disconnected<br />") +
    output.value;
});
</script>

<template>
  <div class="dashboard">
    <div class="connect">
      <InputText v-model="url"></InputText>

      <Button
        :disabled="!isConnected"
        @click="ping"
      >
        Ping
      </Button>

      <Button
        :disabled="!isConnected"
        @click="getLabels"
      >
        Labels
      </Button>

      <Button
        v-if="!isConnected"
        :disabled="connecting"
        @click="connect"
      >
        {{ connecting ? "Connecting" : "Connect" }}
      </Button>

      <Button
        v-else
        @click="disconnect"
      >
        Disconnect
      </Button>
    </div>

    <div
      class="output font-mono"
      v-html="output"
    ></div>
  </div>
</template>

<style scoped>
.dashboard {
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
