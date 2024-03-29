/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../common";

export interface TheLlamasInterface extends utils.Interface {
  functions: {
    "supportsInterface(bytes4)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "allowlistMint(uint256,uint256,bytes)": FunctionFragment;
    "mint()": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "contractURI()": FunctionFragment;
    "set_minter(address)": FunctionFragment;
    "set_al_signer(address)": FunctionFragment;
    "set_base_uri(string)": FunctionFragment;
    "set_contract_uri(string)": FunctionFragment;
    "set_owner(address)": FunctionFragment;
    "set_revealed(bool)": FunctionFragment;
    "withdraw()": FunctionFragment;
    "admin_withdraw_erc20(address,address,uint256)": FunctionFragment;
    "start_al_mint()": FunctionFragment;
    "stop_al_mint()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "tokenByIndex(uint256)": FunctionFragment;
    "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
    "tokensForOwner(address)": FunctionFragment;
    "symbol()": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "base_uri()": FunctionFragment;
    "revealed()": FunctionFragment;
    "default_uri()": FunctionFragment;
    "al_mint_started()": FunctionFragment;
    "al_signer()": FunctionFragment;
    "minter()": FunctionFragment;
    "al_mint_amount(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "supportsInterface"
      | "balanceOf"
      | "ownerOf"
      | "getApproved"
      | "isApprovedForAll"
      | "transferFrom"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "approve"
      | "setApprovalForAll"
      | "allowlistMint"
      | "mint"
      | "tokenURI"
      | "contractURI"
      | "set_minter"
      | "set_al_signer"
      | "set_base_uri"
      | "set_contract_uri"
      | "set_owner"
      | "set_revealed"
      | "withdraw"
      | "admin_withdraw_erc20"
      | "start_al_mint"
      | "stop_al_mint"
      | "totalSupply"
      | "tokenByIndex"
      | "tokenOfOwnerByIndex"
      | "tokensForOwner"
      | "symbol"
      | "name"
      | "owner"
      | "base_uri"
      | "revealed"
      | "default_uri"
      | "al_mint_started"
      | "al_signer"
      | "minter"
      | "al_mint_amount"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "allowlistMint",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "mint", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "contractURI",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "set_minter", values: [string]): string;
  encodeFunctionData(
    functionFragment: "set_al_signer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "set_base_uri",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "set_contract_uri",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "set_owner", values: [string]): string;
  encodeFunctionData(
    functionFragment: "set_revealed",
    values: [boolean]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "admin_withdraw_erc20",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "start_al_mint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stop_al_mint",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensForOwner",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "base_uri", values?: undefined): string;
  encodeFunctionData(functionFragment: "revealed", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "default_uri",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "al_mint_started",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "al_signer", values?: undefined): string;
  encodeFunctionData(functionFragment: "minter", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "al_mint_amount",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "allowlistMint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "set_minter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "set_al_signer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "set_base_uri",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "set_contract_uri",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "set_owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "set_revealed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "admin_withdraw_erc20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "start_al_mint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stop_al_mint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensForOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "base_uri", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "revealed", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "default_uri",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "al_mint_started",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "al_signer", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "minter", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "al_mint_amount",
    data: BytesLike
  ): Result;

  events: {
    "Transfer(address,address,uint256)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
}

export interface TransferEventObject {
  _from: string;
  _to: string;
  _tokenId: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface ApprovalEventObject {
  _owner: string;
  _approved: string;
  _tokenId: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface ApprovalForAllEventObject {
  _owner: string;
  _operator: string;
  _approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  ApprovalForAllEventObject
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export interface TheLlamas extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TheLlamasInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    supportsInterface(
      interface_id: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    ownerOf(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getApproved(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    transferFrom(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    approve(
      approved: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    allowlistMint(
      mint_amount: BigNumberish,
      approved_amount: BigNumberish,
      sig: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    mint(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    tokenURI(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    contractURI(overrides?: CallOverrides): Promise<[string]>;

    set_minter(
      minter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    set_al_signer(
      al_signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    set_base_uri(
      base_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    set_contract_uri(
      new_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    set_owner(
      new_addr: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    set_revealed(
      flag: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    admin_withdraw_erc20(
      coin: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    start_al_mint(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    stop_al_mint(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokensForOwner(
      owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    base_uri(overrides?: CallOverrides): Promise<[string]>;

    revealed(overrides?: CallOverrides): Promise<[boolean]>;

    default_uri(overrides?: CallOverrides): Promise<[string]>;

    al_mint_started(overrides?: CallOverrides): Promise<[boolean]>;

    al_signer(overrides?: CallOverrides): Promise<[string]>;

    minter(overrides?: CallOverrides): Promise<[string]>;

    al_mint_amount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  supportsInterface(
    interface_id: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  ownerOf(token_id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  getApproved(
    token_id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  transferFrom(
    from_addr: string,
    to_addr: string,
    token_id: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256)"(
    from_addr: string,
    to_addr: string,
    token_id: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from_addr: string,
    to_addr: string,
    token_id: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  approve(
    approved: string,
    token_id: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  allowlistMint(
    mint_amount: BigNumberish,
    approved_amount: BigNumberish,
    sig: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  mint(overrides?: Overrides & { from?: string }): Promise<ContractTransaction>;

  tokenURI(token_id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  contractURI(overrides?: CallOverrides): Promise<string>;

  set_minter(
    minter: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  set_al_signer(
    al_signer: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  set_base_uri(
    base_uri: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  set_contract_uri(
    new_uri: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  set_owner(
    new_addr: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  set_revealed(
    flag: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  withdraw(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  admin_withdraw_erc20(
    coin: string,
    target: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  start_al_mint(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  stop_al_mint(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  tokenByIndex(
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokensForOwner(
    owner: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  symbol(overrides?: CallOverrides): Promise<string>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  base_uri(overrides?: CallOverrides): Promise<string>;

  revealed(overrides?: CallOverrides): Promise<boolean>;

  default_uri(overrides?: CallOverrides): Promise<string>;

  al_mint_started(overrides?: CallOverrides): Promise<boolean>;

  al_signer(overrides?: CallOverrides): Promise<string>;

  minter(overrides?: CallOverrides): Promise<string>;

  al_mint_amount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    supportsInterface(
      interface_id: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(token_id: BigNumberish, overrides?: CallOverrides): Promise<string>;

    getApproved(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    approve(
      approved: string,
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    allowlistMint(
      mint_amount: BigNumberish,
      approved_amount: BigNumberish,
      sig: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    mint(overrides?: CallOverrides): Promise<BigNumber>;

    tokenURI(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    contractURI(overrides?: CallOverrides): Promise<string>;

    set_minter(minter: string, overrides?: CallOverrides): Promise<void>;

    set_al_signer(al_signer: string, overrides?: CallOverrides): Promise<void>;

    set_base_uri(base_uri: string, overrides?: CallOverrides): Promise<void>;

    set_contract_uri(new_uri: string, overrides?: CallOverrides): Promise<void>;

    set_owner(new_addr: string, overrides?: CallOverrides): Promise<void>;

    set_revealed(flag: boolean, overrides?: CallOverrides): Promise<void>;

    withdraw(overrides?: CallOverrides): Promise<void>;

    admin_withdraw_erc20(
      coin: string,
      target: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    start_al_mint(overrides?: CallOverrides): Promise<void>;

    stop_al_mint(overrides?: CallOverrides): Promise<void>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokensForOwner(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    symbol(overrides?: CallOverrides): Promise<string>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    base_uri(overrides?: CallOverrides): Promise<string>;

    revealed(overrides?: CallOverrides): Promise<boolean>;

    default_uri(overrides?: CallOverrides): Promise<string>;

    al_mint_started(overrides?: CallOverrides): Promise<boolean>;

    al_signer(overrides?: CallOverrides): Promise<string>;

    minter(overrides?: CallOverrides): Promise<string>;

    al_mint_amount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Transfer(address,address,uint256)"(
      _from?: string | null,
      _to?: string | null,
      _tokenId?: BigNumberish | null
    ): TransferEventFilter;
    Transfer(
      _from?: string | null,
      _to?: string | null,
      _tokenId?: BigNumberish | null
    ): TransferEventFilter;

    "Approval(address,address,uint256)"(
      _owner?: string | null,
      _approved?: string | null,
      _tokenId?: BigNumberish | null
    ): ApprovalEventFilter;
    Approval(
      _owner?: string | null,
      _approved?: string | null,
      _tokenId?: BigNumberish | null
    ): ApprovalEventFilter;

    "ApprovalForAll(address,address,bool)"(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      _owner?: string | null,
      _operator?: string | null,
      _approved?: null
    ): ApprovalForAllEventFilter;
  };

  estimateGas: {
    supportsInterface(
      interface_id: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getApproved(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferFrom(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    approve(
      approved: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    allowlistMint(
      mint_amount: BigNumberish,
      approved_amount: BigNumberish,
      sig: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    mint(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    tokenURI(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    contractURI(overrides?: CallOverrides): Promise<BigNumber>;

    set_minter(
      minter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    set_al_signer(
      al_signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    set_base_uri(
      base_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    set_contract_uri(
      new_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    set_owner(
      new_addr: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    set_revealed(
      flag: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    withdraw(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    admin_withdraw_erc20(
      coin: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    start_al_mint(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    stop_al_mint(overrides?: Overrides & { from?: string }): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    tokenByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokensForOwner(
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    base_uri(overrides?: CallOverrides): Promise<BigNumber>;

    revealed(overrides?: CallOverrides): Promise<BigNumber>;

    default_uri(overrides?: CallOverrides): Promise<BigNumber>;

    al_mint_started(overrides?: CallOverrides): Promise<BigNumber>;

    al_signer(overrides?: CallOverrides): Promise<BigNumber>;

    minter(overrides?: CallOverrides): Promise<BigNumber>;

    al_mint_amount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    supportsInterface(
      interface_id: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    ownerOf(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getApproved(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from_addr: string,
      to_addr: string,
      token_id: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    approve(
      approved: string,
      token_id: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    allowlistMint(
      mint_amount: BigNumberish,
      approved_amount: BigNumberish,
      sig: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    mint(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    tokenURI(
      token_id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    contractURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    set_minter(
      minter: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    set_al_signer(
      al_signer: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    set_base_uri(
      base_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    set_contract_uri(
      new_uri: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    set_owner(
      new_addr: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    set_revealed(
      flag: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    withdraw(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    admin_withdraw_erc20(
      coin: string,
      target: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    start_al_mint(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    stop_al_mint(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokensForOwner(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    base_uri(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    revealed(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    default_uri(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    al_mint_started(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    al_signer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    minter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    al_mint_amount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
