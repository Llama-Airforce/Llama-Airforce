import Fee from "@LAF/Pages/Curve/Gauges/Models/Fee";
import Emission from "@LAF/Pages/Curve/Gauges/Models/Emission";

export default class GaugeSnapshots {
  name: string;
  feeSnapshots: Fee[];
  emissionSnapshots: Emission[];
}
