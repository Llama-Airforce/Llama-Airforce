import { Observable, share } from "rxjs";
import type { Volume } from "@CM/Pages/Pool/Models";
import type { VolumeDto, SocketPool } from "@CM/Services/Sockets";

export default class VolumeService {
  public readonly init$: Observable<Volume[]>;
  public readonly update$: Observable<Volume>;

  constructor(socket: SocketPool) {
    this.init$ = new Observable<Volume[]>((subscriber) => {
      const onData = (data: VolumeDto[]) => {
        const xs = data.map((d) => map(d));
        subscriber.next(xs);
      };

      socket.on("volume_chart", onData);

      return () => {
        socket.off("volume_chart", onData);
      };
    }).pipe(share());

    this.update$ = new Observable<Volume>((subscriber) => {
      const onData = (data: VolumeDto) => {
        const x = map(data);
        subscriber.next(x);
      };

      socket.on("Update Volume-Chart", onData);

      return () => {
        socket.off("Update Volume-Chart", onData);
      };
    }).pipe(share());
  }
}

export function map(volume: VolumeDto): Volume {
  const key = Object.keys(volume)[0];

  const timestamp = parseInt(key, 10);
  const value = volume[key];

  const v: Volume = {
    timestamp,
    volume: value,
  };

  return v;
}
