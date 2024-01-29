import type {
  Proposal,
  ProposalStatus,
} from "@PM/Pages/Proposals/Models/Proposal";

export function getStatus(proposal: Proposal): ProposalStatus {
  if (proposal.status === "executed") {
    return "executed";
  }

  if (proposal.end > new Date().getTime() / 1000) {
    return "active";
  }

  if (hasWon(proposal)) {
    return "passed";
  }

  return "denied";
}

export function hasWon(proposal: Proposal): boolean {
  return proposal.weightReceived > proposal.weightRequired;
}
