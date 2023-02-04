import { io, Socket } from "socket.io-client";

type ClientToServerEvents = {
  search: (input: string) => void;
};

type ServerToClientEvents = {
  search_res: (dto: PoolsDto) => void;
};

type PoolsDto = {
  [poolAddress: string]: string;
};

export type SocketRoot = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocketRoot(url: string) {
  return io(`${url}/`, {
    autoConnect: false,
    secure: true,
  });
}
