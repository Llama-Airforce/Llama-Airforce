import { io, Socket } from "socket.io-client";
import type { Pool } from "@/Pages/CurveMonitor/Models";

type ClientToServerEvents = {
  search: (input: string) => void;
};

type ServerToClientEvents = {
  search_res: (dto: PoolsDto) => void;
};

type PoolsDto = {
  [poolAddress: string]: string;
};

export default class PoolService {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(url: string) {
    this.socket = io(`${url}/`, {
      autoConnect: false,
      secure: true,
    });
  }

  public connect() {
    this.socket.connect();
  }

  public close() {
    this.socket.close();
  }

  public get(input: string): Promise<Pool[]> {
    const promise = new Promise<Pool[]>((resolve) => {
      this.socket.once("search_res", (poolsDto) => {
        const pools = Object.entries(poolsDto).map(([id, name]) => ({
          id: id.toLocaleLowerCase(),
          name,
        }));

        resolve(pools);
      });
    });

    this.socket.emit("search", input);

    return promise;
  }
}
