export const abi = [
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "assetAllocations",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address[]", name: "members", type: "address[]" }],
    name: "getAllocations",
    outputs: [{ internalType: "uint16[16][]", name: "", type: "uint16[16][]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint16[16]", name: "choices", type: "uint16[16]" },
    ],
    name: "recordAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
