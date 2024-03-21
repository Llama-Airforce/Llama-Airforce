import type { Platform } from "@LAF/Pages/Bribes/Models";

const protocols = ["cvx-crv", "cvx-prisma", "cvx-fxn", "aura-bal"] as const;

export type Protocol = (typeof protocols)[number];

export function isProtocol(protocol: string): protocol is Protocol {
  return protocols.includes(protocol as Protocol);
}

export function getProtocols(platform?: Platform): Protocol[] {
  switch (platform) {
    case "votium":
      return ["cvx-crv", "cvx-prisma", "cvx-fxn"];
    case "hh":
      return ["aura-bal"];
    default:
      return [];
  }
}
