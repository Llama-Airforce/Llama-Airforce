import type { Address } from "@/Types/Address";
import { emitAndListen } from "@/Services/Socket";
import type {
  DurationInput,
  IntervalInput,
  SocketMonitorCurve,
} from "../SocketMonitorCurve";

export default class MEVService {
  constructor(private socket: SocketMonitorCurve) {}

  getSandwiches() {
    return emitAndListen(
      this.socket,
      "getFullSandwichTableContent",
      "fullSandwichTableContent",
      "full",
      1
    );
  }

  getLabels() {
    return emitAndListen(
      this.socket,
      "getSandwichLabelOccurrences",
      "sandwichLabelOccurrences"
    );
  }

  getLabelsRanking() {
    return emitAndListen(
      this.socket,
      "getAbsoluteLabelsRanking",
      "absoluteLabelsRanking"
    );
  }

  getPoolSpecificAggregatedMevVolume(
    poolAddress: Address,
    timeDuration: DurationInput,
    timeInterval: IntervalInput
  ) {
    return emitAndListen(
      this.socket,
      "getPoolSpecificAggregatedMevVolume",
      "poolSpecificAggregatedMevVolume",
      poolAddress,
      timeDuration,
      timeInterval
    );
  }
}
