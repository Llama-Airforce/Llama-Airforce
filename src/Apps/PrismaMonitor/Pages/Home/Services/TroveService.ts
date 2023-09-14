import ServiceBase from "@/Services/ServiceBase";

const API_URL = "https://api.thegraph.com/subgraphs/name/benber86/prisma";

type CollateralAPI = {
  name: string;
};

type SnapshotAPI = {
  collateralPrice: string;
  index: number;
  totalDebt: string;
  totalCollateral: string;
  totalCollateralUSD: string;
  collateralRatio: string;
};

export type TroveManager = {
  name: string;
  collateralPrice: number;
  totalDebt: number;
  totalCollateral: number;
  totalCollateralUSD: number;
  collateralRatio: number;
};

export default class TroveService extends ServiceBase {
  public async getTroveManagers(): Promise<TroveManager[]> {
    const query = `{
      troveManagers{
        collateral {
          name
        }
        snapshotsCount
        snapshots(orderBy:index orderDirection: desc first: 1){
          collateralPrice
          index
          totalDebt
          totalCollateral
          totalCollateralUSD
          collateralRatio
        }
      }
    }`;

    const resp = await this.fetch<{
      data: {
        troveManagers: {
          collateral: CollateralAPI;
          snapshotsCounts: number;
          snapshots: SnapshotAPI[];
        }[];
      };
    }>(API_URL, { query });

    const troveManagers = resp.data.troveManagers;

    return troveManagers.map((tm) => {
      const name = tm.collateral.name;
      const ss = tm.snapshots[0];

      const collateralPrice = parseFloat(ss.collateralPrice);
      const totalDebt = parseFloat(ss.totalDebt);
      const totalCollateral = parseFloat(ss.totalCollateral);
      const totalCollateralUSD = parseFloat(ss.totalCollateralUSD);
      const collateralRatio = parseFloat(ss.collateralRatio);

      return {
        name,
        collateralPrice,
        totalDebt,
        totalCollateral,
        totalCollateralUSD,
        collateralRatio,
      };
    });
  }
}
