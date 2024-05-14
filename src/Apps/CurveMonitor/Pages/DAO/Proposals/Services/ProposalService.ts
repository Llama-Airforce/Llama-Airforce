import { ServiceBase } from "@/Services";
import type {
  ProposalStatus,
  ProposalType,
} from "@CM/Pages/DAO/Proposals/Models";
import type * as ApiTypes from "@CM/Pages/DAO/Proposals/Services/ProposalApiTypes";
import * as Parsers from "@CM/Pages/DAO/Proposals/Services/ProposalParsers";

const API_URL = "https://prices.curve.fi";

export default class ProposalService extends ServiceBase {
  public async getProposals(
    page: number,
    search: string,
    type: ProposalType,
    status: ProposalStatus
  ) {
    const resp = await this.fetch<ApiTypes.GetProposalsResponse>(
      `${API_URL}/v1/dao/proposals?pagination=10&page=${page}&search_string=${search}&type_filter=${type}&status_filter=${status}`
    );

    return {
      proposals: resp.proposals.map(Parsers.parseProposal),
      count: resp.count,
    };
  }

  public async getProposal(proposalId: number, proposalType: ProposalType) {
    const resp = await this.fetch<ApiTypes.GetProposalDetailsResponse>(
      `${API_URL}/v1/dao/proposals/details/${proposalType}/${proposalId}`
    );

    return Parsers.parseProposalDetails(resp);
  }
}
