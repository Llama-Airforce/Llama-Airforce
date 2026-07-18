export const abi = [
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "proposals",
    outputs: [
      { internalType: "uint48", name: "startTime", type: "uint48" },
      { internalType: "uint48", name: "endTime", type: "uint48" },
      { internalType: "uint48", name: "epoch", type: "uint48" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "voteTotals",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_gauge", type: "address" },
    ],
    name: "gaugeTotal",
    outputs: [
      { internalType: "uint256", name: "totalWeight", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "getGaugeCount",
    outputs: [
      { internalType: "uint256", name: "gaugeCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "getGaugeEntry",
    outputs: [
      { internalType: "address", name: "gauge", type: "address" },
      { internalType: "uint256", name: "totalWeight", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "isFinalized",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "getVoterCount",
    outputs: [
      { internalType: "uint256", name: "voterCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "getVoterAtIndex",
    outputs: [{ internalType: "address", name: "voter", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "getVote",
    outputs: [
      { internalType: "address[]", name: "gauges", type: "address[]" },
      { internalType: "uint256[]", name: "weights", type: "uint256[]" },
      { internalType: "bool", name: "voted", type: "bool" },
      { internalType: "uint256", name: "baseWeight", type: "uint256" },
      { internalType: "int256", name: "adjustedWeight", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "userInfo",
    outputs: [
      { internalType: "uint96", name: "baseWeight", type: "uint96" },
      { internalType: "int96", name: "adjustedWeight", type: "int96" },
      {
        internalType: "uint48",
        name: "lastVoteSyncNonce",
        type: "uint48",
      },
      { internalType: "uint8", name: "voteStatus", type: "uint8" },
      { internalType: "address", name: "delegate", type: "address" },
      {
        internalType: "uint96",
        name: "totalDelegationWeight",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
