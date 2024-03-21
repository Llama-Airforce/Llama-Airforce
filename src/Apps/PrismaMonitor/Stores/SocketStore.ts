import { defineStore } from "pinia";
import { webSocket, type WebSocketSubject } from "rxjs/webSocket";
import { WS_URL as URL_PRICES } from "@/Services";
import { type Flavor, wsUrl } from "@PM/Models/Flavor";

export type Sockets = "api-lsd" | "api-lrt" | "prices";

function getUrl(socket: Sockets): string {
  switch (socket) {
    case "api-lsd":
      return wsUrl("lsd");
    case "api-lrt":
      return wsUrl("lrt");
    case "prices":
      return URL_PRICES;
    default:
      throw new Error("Unknown socket type");
  }
}

export function getApiSocket(flavor: Flavor) {
  switch (flavor) {
    case "lsd":
      return "api-lsd";
    case "lrt":
      return "api-lrt";
    default:
      throw new Error("Unknown flavor");
  }
}

type State = {
  sockets: Record<Sockets, WebSocketSubject<unknown> | null>;
};

export const useSocketStore = defineStore({
  id: "socketStore",
  state: (): State => ({
    sockets: {
      "api-lsd": null,
      "api-lrt": null,
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
