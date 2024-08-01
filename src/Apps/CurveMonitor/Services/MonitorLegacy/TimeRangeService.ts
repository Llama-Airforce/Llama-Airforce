import type { TimeRange } from "@CM/Models";
import { type SocketPool } from "@CM/Services/MonitorLegacy";

export default class TimeRangeService {
  private readonly socket: SocketPool;

  constructor(socket: SocketPool) {
    this.socket = socket;
  }

  update(timeRange: TimeRange) {
    this.socket.emit(timeRange);
  }
}
