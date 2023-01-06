import type { Platform, Protocol } from "@/Pages/Bribes/Models";

/** A product is simply the combination of a platform and protocol. */
export type Product = {
  /** The bribe platform used, like Votium or Hidden Hand. */
  platform: Platform;

  /** The protocol for which the bribe is, like `crv` or `bal`. */
  protocol: Protocol;
};
