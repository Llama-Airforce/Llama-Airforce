import type { TimeRange } from "@/Pages/CurveMonitor/Models";
import type { SocketPool } from "@/Pages/CurveMonitor/Services/Sockets";

export default class TimeRangeService {
  private readonly socket: SocketPool;

  constructor(socket: SocketPool) {
    this.socket = socket;
  }

  update(timeRange: TimeRange) {
    this.socket.emit(timeRange);
  }
}
