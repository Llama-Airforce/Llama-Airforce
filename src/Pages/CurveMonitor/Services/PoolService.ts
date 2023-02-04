import type { Pool } from "@/Pages/CurveMonitor/Models";
import type { SocketRoot } from "@/Pages/CurveMonitor/Services/Sockets";

export default class PoolService {
  private readonly socket: SocketRoot;

  constructor(socket: SocketRoot) {
    this.socket = socket;
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
