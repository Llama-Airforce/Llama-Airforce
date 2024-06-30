export const abi = [
  {
    inputs: [
      { internalType: "enum LpxCvx.Token", name: "source", type: "uint8" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minReceived", type: "uint256" },
      { internalType: "uint256", name: "fromIndex", type: "uint256" },
      { internalType: "uint256", name: "toIndex", type: "uint256" },
    ],
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "unwrap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "wrap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
