export type Flavor = "lsd" | "lrt";

export function stableSymbol(flavor: Flavor): string {
  switch (flavor) {
    case "lsd":
      return "mkUSD";
    case "lrt":
      return "ULTRA";
    default:
      return "???";
  }
}

export function apiUrl(flavor: Flavor): string {
  switch (flavor) {
    case "lsd":
      return "https://api.prismamonitor.com/v1";
    case "lrt":
      return "https://api.ultra.prismamonitor.com/v1";
    default:
      return "";
  }
}

export function wsUrl(flavor: Flavor): string {
  switch (flavor) {
    case "lsd":
      return "wss://api.prismamonitor.com/v1/prisma/ws";
    case "lrt":
      return "wss://api.ultra.prismamonitor.com/v1/prisma/ws";
    default:
      return "";
  }
}
