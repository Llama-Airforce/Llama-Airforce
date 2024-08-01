import { io, type Socket } from "socket.io-client";

type ClientToServerEvents = {
  ping: () => void;
  search: (input: string) => void;
};

type ServerToClientEvents = {
  pong: () => void;
  search_res: (dto: PoolsDto) => void;
};

type PoolsDto = {
  [poolAddress: string]: string;
};

export type SocketRoot = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocketRoot(url: string): SocketRoot {
  return io(`${url}/`, {
    autoConnect: false,
    secure: true,
  });
}
