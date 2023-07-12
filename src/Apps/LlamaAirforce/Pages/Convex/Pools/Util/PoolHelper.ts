import { Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";

export function totalApr(pool: Pool): number {
  return pool.baseApr + pool.crvApr + pool.cvxApr + pool.extraRewardsApr;
}
