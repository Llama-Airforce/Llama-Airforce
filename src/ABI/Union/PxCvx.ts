export const abi = [
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "snapshotId", type: "uint256" },
    ],
    name: "balanceOfAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentEpoch",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "epoch", type: "uint256" }],
    name: "getEpoch",
    outputs: [
      { internalType: "uint256", name: "snapshotId", type: "uint256" },
      { internalType: "bytes32[]", name: "rewards", type: "bytes32[]" },
      { internalType: "uint256[]", name: "snapshotRewards", type: "uint256[]" },
      { internalType: "uint256[]", name: "futuresRewards", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "epoch", type: "uint256" },
    ],
    name: "getEpochRedeemedSnapshotRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "snapshotId", type: "uint256" }],
    name: "totalSupplyAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
