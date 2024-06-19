export const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "lock", type: "bool" },
    ],
    name: "claimFromVaultAsCvx",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "claimFromVaultAsEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "claimFromVaultAsFxs",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "claimFromVaultAsUsdt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "router", type: "address" },
      { internalType: "address", name: "outputToken", type: "address" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "claimFromVaultViaUniV2EthPair",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "lock", type: "bool" },
    ],
    name: "depositFromEth",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "lock", type: "bool" },
    ],
    name: "depositFromFxs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "depositFromUFxs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "minAmountOut", type: "uint256" },
      { internalType: "address", name: "router", type: "address" },
      { internalType: "address", name: "inputToken", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "bool", name: "lock", type: "bool" },
    ],
    name: "depositViaUniV2EthPair",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;