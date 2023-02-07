import { Observable } from "rxjs";
import type { Volume } from "@/Pages/CurveMonitor/Models";
import type {
  VolumeDto,
  SocketPool,
} from "@/Pages/CurveMonitor/Services/Sockets";

export default class VolumeService {
  public readonly get$: Observable<Volume>;

  constructor(socket: SocketPool) {
    this.get$ = new Observable((subscriber) => {
      const onData = (data: VolumeDto | VolumeDto[]) => {
        const volumes = Array.isArray(data)
          ? data.map((d) => this.get(d))
          : [this.get(data)];

        for (const volume of volumes) {
          subscriber.next(volume);
        }
      };

      socket.on("volume_chart", onData);
      socket.on("Update Volume-Chart", onData);

      return () => {
        socket.off("volume_chart", onData);
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
