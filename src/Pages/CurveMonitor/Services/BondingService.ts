import { Observable } from "rxjs";
import { zipWith } from "lodash";
import type { Bonding } from "@/Pages/CurveMonitor/Models";
import type {
  BondingDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class BondingService {
  public readonly get$: Observable<Bonding>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable((subscriber) => {
      const onData = (data: BondingDto) => {
        const bondings = this.get(data);

        for (const bonding of bondings) {
          subscriber.next(bonding);
        }
      };

      socket.on("bonding_curve", onData);

      return () => {
        socket.off("bonding_curve", onData);
      };
    });
  }

  private get(bonding: BondingDto): Bonding[] {
    return zipWith(bonding.x, bonding.y, (x, y): Bonding => ({ x, y }));
  }
}
