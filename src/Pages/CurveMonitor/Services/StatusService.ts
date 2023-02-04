import { Observable, of, tap, delay, repeat, shareReplay } from "rxjs";
import type { SocketRoot } from "@/Pages/CurveMonitor/Services/Sockets";

export default class StatusService {
  /** Returns the time in ms since the last ping pong. */
  public readonly get$: Observable<number>;

  constructor(socket: SocketRoot) {
    this.get$ = new Observable<number>((subscriber) => {
      let pollTime = Infinity;
      let pinging = false;

      const onPong = () => {
        subscriber.next(Date.now() - pollTime);
        pinging = false;
      };

      socket.on("pong", onPong);

      const poll$_ = of({})
        .pipe(
          tap(() => {
            if (pinging) {
              /*
               * We're pinging again when the previous one failed!
               * Tell the poor subscriber our connection sucks.
               */
              subscriber.next(Infinity);
              return;
            }

            pinging = true;
            pollTime = Date.now();
            socket.emit("ping");
          }),
          delay(5000),
          repeat()
        )
        .subscribe();

      return () => {
        poll$_.unsubscribe();
        socket.off("pong", onPong);
      };
    }).pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  }
}
