export const abi = [
  {
    inputs: [],
    name: "MAX_REDEMPTION_TIME",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "enum PirexCvx.Fees", name: "", type: "uint8" }],
    name: "fees",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "redemptions",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "lockIndexes", type: "uint256[]" },
      { internalType: "enum PirexCvx.Futures", name: "f", type: "uint8" },
      { internalType: "uint256[]", name: "assets", type: "uint256[]" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "initiateRedemptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "epoch", type: "uint256" },
      { internalType: "uint256[]", name: "rewardIndexes", type: "uint256[]" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "redeemSnapshotRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "epoch", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "redeemFuturesRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "unlockTimes",
        type: "uint256[]",
      },
      { internalType: "uint256[]", name: "assets", type: "uint256[]" },
      { internalType: "address", name: "receiver", type: "address" },
    ],
    name: "redeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
