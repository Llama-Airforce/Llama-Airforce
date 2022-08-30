import { hostDev, hostProd } from "@/Services/ServiceBase";
import { isDevelopment } from "@/Util/DevHelper";

export function getHost(): string {
  return isDevelopment() ? hostDev : hostProd;
}
