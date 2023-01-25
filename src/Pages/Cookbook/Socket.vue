<template>
  <div class="socket">
    <div class="dashboard">
      <div class="connect">
        <InputText v-model="url"></InputText>

        <Button
          v-if="!connected"
          value="Connect"
          @click="connect"
        ></Button>
        <Button
          v-else
          value="Disconnect"
          @click="disconnect"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { io, Socket } from "socket.io-client";
import { InputText, Button } from "@/Framework";

type ClientToServerEvents = Record<string, never>;
type ServerToClientEvents = {
  message: (msg: string) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

// Refs
const url = $ref("https://ws.llama.airforce:2053");
let connected = $ref(false);

// Methods
const connect = () => {
  socket = io(`${url}`, {
    autoConnect: false,
    reconnection: false,
    secure: true,
  });

  socket.on("connect_error", (err) => console.log(err));
  socket.on("message", (msg) => {
    console.log(msg);
    connected = true;
  });

  socket.connect();
};

const disconnect = () => {
  socket?.close();
  socket = null;

  connected = false;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("socket");

.connect {
  display: flex;
  gap: 1rem;
}
</style>
