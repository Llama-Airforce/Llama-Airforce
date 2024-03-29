/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  AssetRegistry,
  AssetRegistryInterface,
} from "../../Registries/AssetRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "assetAllocations",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    name: "getAllocations",
    outputs: [
      {
        internalType: "uint16[16][]",
        name: "",
        type: "uint16[16][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16[16]",
        name: "choices",
        type: "uint16[16]",
      },
    ],
    name: "recordAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class AssetRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): AssetRegistryInterface {
    return new utils.Interface(_abi) as AssetRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AssetRegistry {
    return new Contract(address, _abi, signerOrProvider) as AssetRegistry;
  }
}
