import { defineStore } from "pinia";
import { webSocket, type WebSocketSubject } from "rxjs/webSocket";
import { WS_URL as URL_PRICES } from "@/Services";
import { WS_URL as URL_API } from "@PM/Services";

export type Sockets = "api" | "prices";

function getUrl(socket: Sockets): string {
  switch (socket) {
    case "api":
      return URL_API;
    case "prices":
      return URL_PRICES;
    default:
      throw new Error("Unknown socket type");
  }
}

type State = {
  sockets: Record<Sockets, WebSocketSubject<unknown> | null>;
};

export const useSocketStore = defineStore({
  id: "socketStore",
  state: (): State => ({
    sockets: {
      api: null,
      prices: null,
    },
  }),
  getters: {
    getSocket: (state) => (socket: Sockets) => {
      if (!state.sockets[socket]) {
        const url = getUrl(socket);
        state.sockets[socket] = webSocket(url);
      }

      return state.sockets[socket];
    },
  },
});
