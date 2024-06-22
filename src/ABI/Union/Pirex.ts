export const abi = [
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
] as const;
