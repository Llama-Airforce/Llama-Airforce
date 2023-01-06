import { isDevelopment } from "@/Util";
import { hostDev, hostProd } from "@/Services/ServiceBase";

export function getHost(): string {
  return isDevelopment() ? hostDev : hostProd;
}
