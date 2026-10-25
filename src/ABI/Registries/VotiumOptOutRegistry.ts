export const abi = [
  {
    type: "function",
    name: "deployEpoch",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint32" }]
  },
  {
    type: "function",
    name: "isOptedOutAtEpoch",
    stateMutability: "view",
    inputs: [
      { name: "_gauge", type: "address" },
      { name: "_user", type: "address" },
      { name: "_epoch", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "withheldWeightForUsers",
    stateMutability: "view",
    inputs: [
      { name: "_gauge", type: "address" },
      { name: "_epoch", type: "uint256" },
      { name: "_users", type: "address[]" }
    ],
    outputs: [{ name: "", type: "uint256" }]
  }
] as const;
