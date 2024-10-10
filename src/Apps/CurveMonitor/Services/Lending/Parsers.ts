import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parseLoanDistribution = (
  x: ApiTypes.GetLoanDistributionResponse
): Models.LoanDistribution => {
  return {
    stablecoin: x.stablecoin.map((x) => ({ value: x.value, label: x.label })),
    debt: x.debt.map((x) => ({ value: x.value, label: x.label })),
    collateral: x.collateral.map((x) => ({ value: x.value, label: x.label })),
  };
};
