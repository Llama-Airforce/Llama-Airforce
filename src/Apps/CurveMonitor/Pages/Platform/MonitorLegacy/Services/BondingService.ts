import { Observable, share } from "rxjs";
import { zipWith } from "lodash";
import { type SocketPool } from "@CM/Services/Sockets";
import { type BondingDto } from "@CM/Services/Sockets/SocketPool";
import type { Bonding } from "@CM/Pages/Platform/MonitorLegacy/Models";

export default class BondingService {
  public readonly get$: Observable<Bonding>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable<Bonding>((subscriber) => {
      const onData = (data: BondingDto) => {
        const bonding = map(data);
        subscriber.next(bonding);
      };

      socket.on("bonding_curve", onData);

      return () => {
        socket.off("bonding_curve", onData);
      };
    }).pipe(share());
  }
}

export function map(bonding: BondingDto): Bonding {
  const curve = zipWith(bonding.x, bonding.y, (x, y) => ({ x, y }));

  return {
    curve,
    balanceCoin0: bonding.balance0,
    balanceCoin1: bonding.balance1,
  };
}
