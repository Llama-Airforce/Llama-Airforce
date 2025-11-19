import type { Address } from "viem";
import { abi as abiPirexRPxCvx } from "@/ABI/Union/PirexRPxCvx";
import { abi as abiPxCvx } from "@/ABI/Union/PxCvx";
import { PxCvxAddress, RPxCvxAddress } from "@/Utils/Addresses";
import { chunk } from "@/Utils/Array";
import {
  getPublicClient,
  readContract,
  readContracts,
  type Config,
} from "@wagmi/core";

const PIREX_CONVEX_FIRST_EPOCH = 1655942400n;
const PIREX_EPOCH_SECONDS = 1209600n;

const extractAddress = (epochReward: readonly Address[]) =>
  epochReward.reduce<Address[]>(
    (memo, rewardAddress) =>
      [...memo, rewardAddress.substring(0, 42)] as Address[],
    []
  );

// eslint-disable-next-line max-lines-per-function
export async function getPirexRewards(
  config: Config,
  address: Address,
  page: number,
  pageSize: number = 25
) {
  const client = getPublicClient(config);
  if (!client) throw Error("Cannot create public viem client");

  const currentEpoch = await readContract(config, {
    address: PxCvxAddress,
    abi: abiPxCvx,
    functionName: "getCurrentEpoch",
  });

  const totalAmountOfEpochs =
    Number((currentEpoch - PIREX_CONVEX_FIRST_EPOCH) / PIREX_EPOCH_SECONDS) + 1;

  const pirexEpochs = Array.from({
    length: Math.min(totalAmountOfEpochs, pageSize),
  })
    .map(
      (_, i) =>
        PIREX_CONVEX_FIRST_EPOCH +
        BigInt(i + page * pageSize) * PIREX_EPOCH_SECONDS
    )
    .filter((epoch) => epoch <= currentEpoch);

  if (pirexEpochs.length === 0) {
    return { snapshotRewards: [], futuresRewards: [], paginationDone: true };
  }

  const epochData = await readContracts(config, {
    contracts: pirexEpochs.map((epoch) => ({
      address: PxCvxAddress,
      abi: abiPxCvx,
      functionName: "getEpoch" as const,
      args: [epoch],
    })),
    allowFailure: false,
  });

  const futuresDataRaw = await readContracts(config, {
    contracts: pirexEpochs
      .map((epoch) => [
        {
          address: RPxCvxAddress as Address,
          abi: abiPirexRPxCvx,
          functionName: "balanceOf" as const,
          args: [address, epoch],
        },
        {
          address: RPxCvxAddress as Address,
          abi: abiPirexRPxCvx,
          functionName: "totalSupply" as const,
          args: [epoch],
        },
      ])
      .flat(),
    allowFailure: false,
  });
  const futuresData = chunk(futuresDataRaw, 2);

  const balanceDataRaw = await readContracts(config, {
    contracts: epochData
      .map((epoch, i) => [
        {
          address: PxCvxAddress as Address,
          abi: abiPxCvx,
          functionName: "balanceOfAt" as const,
          args: [address, epoch[0]],
        },
        {
          address: PxCvxAddress as Address,
          abi: abiPxCvx,
          functionName: "totalSupplyAt" as const,
          args: [epoch[0]],
        },
        {
          address: PxCvxAddress as Address,
          abi: abiPxCvx,
          functionName: "getEpochRedeemedSnapshotRewards" as const,
          args: [address, pirexEpochs[i]],
        },
      ])
      .flat(),
    allowFailure: false,
  });
  const balanceData = chunk(balanceDataRaw, 3);

  const snapshotRewardsRaw = balanceData.map((data, i) => {
    const [userBalanceAtSnapshot, totalSupplyAtSnapshot, rewardsBitmap] = data;

    const redeemedRewards = epochData[i][1].reduce<boolean[]>(
      (memo, _, rewardIndex) => [
        ...memo,
        // eslint-disable-next-line no-bitwise
        (parseFloat(rewardsBitmap.toString()) & (1 << rewardIndex)) !== 0,
      ],
      []
    );

    const snapshotRewardAmount = epochData[i][2].reduce<bigint[]>(
      (memo, snapshotReward) => [
        ...memo,
        (snapshotReward * userBalanceAtSnapshot) / totalSupplyAtSnapshot,
      ],
      []
    );

    const addresses = extractAddress(epochData[i][1]);
    const rewardIndices = epochData[i][1].reduce<number[]>(
      (memo, _, rewardIndex) => [...memo, rewardIndex],
      []
    );

    return addresses.map((address, j) => ({
      address: address.toLocaleLowerCase() as unknown as Address,
      rewardAmount: BigInt(snapshotRewardAmount[j].toString()),
      rewardIndex: rewardIndices[j],
      isClaimed: redeemedRewards[j],
      epoch: Number(pirexEpochs[i]),
    }));
  });

  const snapshotRewards = snapshotRewardsRaw
    .map((epoch) =>
      epoch.filter((reward) => !reward.isClaimed && reward.rewardAmount !== 0n)
    )
    .filter((data) => data.length !== 0)
    .flat();

  const futuresRewardsRaw = futuresData.map((data, i) => {
    const [tokenBalance, totalSupply] = data;

    const futuresRewardAmount = epochData[i][3].reduce<bigint[]>(
      (memo, snapshotReward) => [
        ...memo,
        (snapshotReward * tokenBalance) / (totalSupply || 1n),
      ],
      []
    );
    const addresses = extractAddress(epochData[i][1]);

    return addresses.map((address, j) => ({
      address: address.toLocaleLowerCase() as unknown as Address,
      rewardAmount: BigInt(futuresRewardAmount[j].toString()),
      epoch: Number(pirexEpochs[i]),
    }));
  });

  const futuresRewards = futuresRewardsRaw
    .map((epoch) => epoch.filter((reward) => reward.rewardAmount !== 0n))
    .filter((data) => data.length !== 0)
    .flat();

  return { snapshotRewards, futuresRewards, paginationDone: false };
}
