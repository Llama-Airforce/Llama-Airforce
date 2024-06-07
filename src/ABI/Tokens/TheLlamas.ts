export const abi = [
  {
    stateMutability: "view",
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "token_id", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    name: "tokensForOwner",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
] as const;
