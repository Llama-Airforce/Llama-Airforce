import Fee from "@CM/Pages/Platform/Gauges/Models/Fee";
import Emission from "@CM/Pages/Platform/Gauges/Models/Emission";

export default class GaugeSnapshots {
  name: string;
  feeSnapshots: Fee[];
  emissionSnapshots: Emission[];
}
