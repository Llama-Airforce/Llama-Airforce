import type { Epoch, Protocol, VoteSource } from "@LAF/Pages/Bribes/Models";

type ConvexOnchainProtocol = Extract<Protocol, "cvx-crv" | "cvx-fxn">;
const VOTIUM_EPOCH_SECONDS = 86400 * 14;
const VOTIUM_CVX_CRV_FIRST_CURVE_EPOCH = 1348;
const VOTIUM_CVX_FXN_CURVE_EPOCH_OFFSET = 65;

export function getVoteSource(
  epoch: Pick<Epoch, "voteSource">
): VoteSource {
  return epoch.voteSource ?? "snapshot";
}

export function getVotiumRoundTimestamp(
  protocol: ConvexOnchainProtocol,
  round: number
): number {
  const curveEpoch =
    VOTIUM_CVX_CRV_FIRST_CURVE_EPOCH +
    round +
    (protocol === "cvx-fxn" ? VOTIUM_CVX_FXN_CURVE_EPOCH_OFFSET : 0);

  return curveEpoch * VOTIUM_EPOCH_SECONDS;
}
