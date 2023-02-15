import { Observable } from "rxjs";
import type { Volume } from "@/Pages/CurveMonitor/Models";
import type {
  VolumeDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class VolumeService {
  public readonly init$: Observable<Volume[]>;
  public readonly update$: Observable<Volume>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable((subscriber) => {
      const onData = (data: VolumeDto[]) => {
        const xs = data.map((d) => this.get(d));
        subscriber.next(xs);
      };

      socket.on("volume_chart", onData);

      return () => {
        socket.off("volume_chart", onData);
      };
    });

    this.update$ = new Observable((subscriber) => {
      const onData = (data: VolumeDto) => {
        const x = this.get(data);
        subscriber.next(x);
      };

      socket.on("Update Volume-Chart", onData);

      return () => {
        socket.off("Update Volume-Chart", onData);
      };
    });
  }

  private get(volume: VolumeDto): Volume {
    const key = Object.keys(volume)[0];

    const timestamp = parseInt(key, 10);
    const value = volume[key];

    const v: Volume = {
      timestamp,
      volume: value,
    };

    return v;
  }
}
