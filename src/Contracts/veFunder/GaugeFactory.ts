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

export interface GaugeFactoryInterface extends utils.Interface {
  functions: {
    "deploy_gauge(address,uint256)": FunctionFragment;
    "implementation()": FunctionFragment;
    "get_gauge_count()": FunctionFragment;
    "get_gauge_by_idx(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "deploy_gauge"
      | "implementation"
      | "get_gauge_count"
      | "get_gauge_by_idx"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deploy_gauge",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "implementation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get_gauge_count",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "get_gauge_by_idx",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "deploy_gauge",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "implementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "get_gauge_count",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "get_gauge_by_idx",
    data: BytesLike
  ): Result;

  events: {
    "NewGauge(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewGauge"): EventFragment;
}

export interface NewGaugeEventObject {
  _instance: string;
  _receiver: string;
  _max_emissions: BigNumber;
}
export type NewGaugeEvent = TypedEvent<
  [string, string, BigNumber],
  NewGaugeEventObject
>;

export type NewGaugeEventFilter = TypedEventFilter<NewGaugeEvent>;

export interface GaugeFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: GaugeFactoryInterface;

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
    deploy_gauge(
      _receiver: string,
      _max_emissions: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    implementation(overrides?: CallOverrides): Promise<[string]>;

    get_gauge_count(overrides?: CallOverrides): Promise<[BigNumber]>;

    get_gauge_by_idx(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  deploy_gauge(
    _receiver: string,
    _max_emissions: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  implementation(overrides?: CallOverrides): Promise<string>;

  get_gauge_count(overrides?: CallOverrides): Promise<BigNumber>;

  get_gauge_by_idx(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    deploy_gauge(
      _receiver: string,
      _max_emissions: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    implementation(overrides?: CallOverrides): Promise<string>;

    get_gauge_count(overrides?: CallOverrides): Promise<BigNumber>;

    get_gauge_by_idx(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "NewGauge(address,address,uint256)"(
      _instance?: string | null,
      _receiver?: string | null,
      _max_emissions?: null
    ): NewGaugeEventFilter;
    NewGauge(
      _instance?: string | null,
      _receiver?: string | null,
      _max_emissions?: null
    ): NewGaugeEventFilter;
  };

  estimateGas: {
    deploy_gauge(
      _receiver: string,
      _max_emissions: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    implementation(overrides?: CallOverrides): Promise<BigNumber>;

    get_gauge_count(overrides?: CallOverrides): Promise<BigNumber>;

    get_gauge_by_idx(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    deploy_gauge(
      _receiver: string,
      _max_emissions: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    implementation(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    get_gauge_count(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    get_gauge_by_idx(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
