import { isDevelopment } from "@/Util/DevHelper";
import { hostDev, hostProd } from "@/Services/ServiceBase";

export function getHost(): string {
  return isDevelopment() ? hostDev : hostProd;
}
