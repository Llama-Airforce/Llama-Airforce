export const abi = [
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_epoch", type: "uint256" },
    ],
    name: "getDelegateAtEpoch",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_epoch", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "userWeightAtEpochOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_epoch", type: "uint256" },
      { internalType: "address", name: "_delegate", type: "address" },
    ],
    name: "balanceAtEpochOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_epoch", type: "uint256" },
    ],
    name: "getSyncSnapshot",
    outputs: [
      { internalType: "uint256", name: "preSyncWeight", type: "uint256" },
      { internalType: "uint256", name: "snapshotNonce", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
