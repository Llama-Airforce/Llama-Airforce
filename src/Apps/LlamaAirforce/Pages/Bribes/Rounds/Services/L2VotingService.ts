import { type JsonRpcProvider } from "@ethersproject/providers";
import { type ContractCallResults, Multicall } from "ethereum-multicall";
import {
  type CallReturnContext,
  type CallContext,
} from "ethereum-multicall/dist/esm/models";
import GaugeVotePlatformABI from "@/ABI/Convex/GaugeVotePlatform.json";
import { type GaugeVotePlatform } from "@/Contracts";
import { chunk, paginate } from "@/Util";
import { fetchType as fetch } from "@/Services/ServiceBase";

type UserLeaf = {
  leaf: string;
  proof: string[];
  base_amount: string;
  adjusted_amount: string;
  delegate: string;
};

type BaseMerkle = {
  root: string;
  blockHeight: number;
  users: {
    [user: string]: UserLeaf;
  };
};

type Proposal = {
  id: number;
  baseWeightMerkleRoot: string;
  startTime: bigint;
  endTime: bigint;
};

type Voter = string;

export type Vote = {
  voter: string;
  gauges: string[];
  weights: bigint[];
  voted: boolean;
  baseWeight: bigint;
  adjustedWeight: bigint;
};

/** To be used the active voting state of a proposal. */
export type StateUser = {
  gauges: string[];
  weights: bigint[];
  voted: boolean;
  score: bigint;
  delegate: string;
};

/** Key = user address */
type State = Record<string, StateUser>;

/**
 * Normal plan to get the full state of a proposal:
 * 1. Get the proposal by proposal id.
 * 2. Get base merkle proof data via
 *    https://raw.githubusercontent.com/convex-eth/voting-data/main/proofs/proofs_${proposal.id}.json
 *    This also contains delegate information.
 *
 * 3. Convert the base merkle into an initial state.
 *    Every user's starting score is `base_amount` from that proof.
 *    They start with no vote, no gauges and no weights.
 *
 * 4. Then, get all voters and corresponding votes to update state with new vote data accordingly.
 *    If original user voted, override score with base weight from vote, copy over gauges and gauge weights.
 *    If not original user but their delegate voted, use delegate's gauges and weights, dont copy their score.
 *    Adjusted weights can be ignored as this is delegated weight and has no effect on a user's score.
 */
export class L2VotingService {
  public readonly provider: JsonRpcProvider;
  public readonly votePlatform: GaugeVotePlatform;
  public readonly multicall: Multicall;

  private readonly Reference = "votePlatform";
  private readonly BatchSize = 150;

  constructor(provider: JsonRpcProvider, votePlatform: GaugeVotePlatform) {
    this.provider = provider;
    this.votePlatform = votePlatform;

    this.multicall = new Multicall({
      multicallCustomContractAddress:
        "0xcA11bde05977b3631167028862bE2a173976CA11",
      ethersProvider: provider,
      tryAggregate: false,
    });
  }

  /** Helper method for invoking a multicall call. */
  private async invokeMulticall(
    calls: CallContext[]
  ): Promise<CallReturnContext[]> {
    const contractCallContext = [
      {
        reference: this.Reference,
        contractAddress: this.votePlatform.address,
        abi: GaugeVotePlatformABI as unknown[],
        calls,
      },
    ];

    const results: ContractCallResults = await this.multicall.call(
      contractCallContext
    );

    const returnContext = results.results.votePlatform.callsReturnContext;
    return returnContext;
  }

  /**
   * Gets the (initial) base weight merkle tree (including delegators) for a given proposal.
   * @param proposal The proposal to get the initial tree for.
   */
  public async getBaseMerkle(proposal: Proposal): Promise<BaseMerkle> {
    const merkleRoot = proposal.baseWeightMerkleRoot;
    const url = `https://raw.githubusercontent.com/convex-eth/voting-data/main/proofs/proofs_${merkleRoot}.json`;

    const baseMerkle = await fetch<BaseMerkle>(url);

    // Turn user addresses into lowercase.
    baseMerkle.users = Object.fromEntries(
      Object.entries(baseMerkle.users).map(([k, v]) => [k.toLowerCase(), v])
    );

    // Turn delegate addresses into lowercase.
    for (const user of Object.values(baseMerkle.users)) {
      user.delegate = user.delegate.toLocaleLowerCase();
    }

    return baseMerkle;
  }

  /** Gets the state of a single user using Convex's API, including its delegate if set. */
  // TODO: properly unit test.
  public async getUserState(
    proposal: Proposal,
    address: string
  ): Promise<State> {
    const { userData: leaf } = await fetch<{ userData: UserLeaf }>(
      `https://www.convexfinance.com/api/gauge-weight-proposal-proof-info?address=${address}&root=${proposal.baseWeightMerkleRoot}`
    );

    // Turn delegate addresses into lowercase.
    leaf.delegate = leaf.delegate.toLocaleLowerCase();

    const state = {
      [address]: {
        gauges: [] as string[],
        weights: [] as bigint[],
        voted: false,
        score: BigInt(leaf.base_amount),
        delegate: leaf.delegate,
      },
    };

    if (leaf.delegate !== address) {
      const { userData: leafDelegate } = await fetch<{ userData: UserLeaf }>(
        `https://www.convexfinance.com/api/gauge-weight-proposal-proof-info?address=${leaf.delegate}&root=${proposal.baseWeightMerkleRoot}`
      );

      // Turn delegate addresses into lowercase.
      leafDelegate.delegate = leafDelegate.delegate.toLocaleLowerCase();

      state[leaf.delegate] = {
        gauges: [] as string[],
        weights: [] as bigint[],
        voted: false,
        score: BigInt(leafDelegate.base_amount),
        delegate: leafDelegate.delegate,
      };
    }

    return state;
  }

  /**
   * Gets a proposal based on its id.
   * @param proposalId The proposal id to get the proposal for.
   */
  public async getProposal(proposalId: number): Promise<Proposal> {
    return this.votePlatform.proposals(proposalId).then((x) => ({
      id: proposalId,
      baseWeightMerkleRoot: x.baseWeightMerkleRoot,
      startTime: x.startTime.toBigInt(),
      endTime: x.endTime.toBigInt(),
    }));
  }

  /**
   * Gets a list of voters that voted in a proposal.
   * @param proposalId The proposal id to get a list of voters for.
   */
  public async getVoters(proposalId: number): Promise<Voter[]> {
    const numVoters = await this.votePlatform
      .getVoterCount(proposalId)
      .then((x) => Number(x.toBigInt()));

    const calls = new Array(numVoters).fill(null).map((_, i) => ({
      reference: this.Reference,
      methodName: "getVoterAtIndex",
      methodParameters: [proposalId, i],
    }));
    const callPages = chunk(calls, this.BatchSize);

    // Multicall batching.
    const getVoterPage = async (page: number) => {
      const values = await this.invokeMulticall(callPages[page]);
      const votersChunk = values
        .map((x) => x.returnValues[0] as string)
        .map((x) => x.toLocaleLowerCase());

      return votersChunk;
    };

    const voters = await paginate(getVoterPage, 0, this.BatchSize);

    return voters;
  }

  /**
   * Gets a list of votes for a given list of voters and proposal.
   * @param proposalId The proposal id to get a list of votes for.
   * @param voters The list of voters to get a list of votes for.
   */
  public async getVotes(proposalId: number, voters: string[]): Promise<Vote[]> {
    const calls = voters.map((voter) => ({
      reference: this.Reference,
      methodName: "getVote",
      methodParameters: [proposalId, voter],
    }));
    const callPages = chunk(calls, this.BatchSize);

    // Multicall batching.
    const getVotePage = async (page: number) => {
      const values = await this.invokeMulticall(callPages[page]);
      const votersChunk = values.map((x) => {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access  */
        /* eslint-disable @typescript-eslint/no-explicit-any  */
        return {
          voter: (x.methodParameters[1] as string).toLocaleLowerCase(),
          gauges: (x.returnValues[0] as string[]).map((x) =>
            x.toLocaleLowerCase()
          ),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          weights: (x.returnValues[1] as any[]).map((x) =>
            BigInt(x.hex as string)
          ),
          voted: x.returnValues[2] as boolean,
          baseWeight: BigInt(x.returnValues[3].hex as string),
          adjustedWeight: BigInt(x.returnValues[4].hex as string),
        };
        /* eslint-enable */
      });

      return votersChunk;
    };

    const votes = await paginate(getVotePage, 0, this.BatchSize);

    return votes;
  }

  /** Converts the initial base merkle to a new initial state with user info. */
  public baseMerkleToState(merkle: BaseMerkle): State {
    const statesUsers: Record<string, StateUser>[] = Object.entries(
      merkle.users
    ).map(([user, info]) => ({
      [user.toLocaleLowerCase()]: {
        gauges: [] as string[],
        weights: [] as bigint[],
        voted: false,
        score: BigInt(info.base_amount),
        delegate: info.delegate,
      },
    }));

    const state = Object.assign({}, ...statesUsers) as State;

    return state;
  }

  /**
   * Apply a single vote to the existing state. This mutates the given state.
   * @param state The state to apply the vote to.
   * @param vote The vote to apply to the state.
   */
  public applyVote(state: State, vote: Vote): State {
    // Sanity check.
    if (!vote.voted) {
      return state;
    }

    // First, apply the vote to user itself, this overrules any delegator vote.
    const stateVote = state[vote.voter];
    stateVote.score = vote.baseWeight;
    stateVote.gauges = vote.gauges;
    stateVote.weights = vote.weights;
    stateVote.voted = true;

    // Next, we want to apply the weights to users that haven't voted yet and have set this voter as delegate.
    const subjects = Object.entries(state)
      .filter(([, info]) => !info.voted && info.delegate === vote.voter)
      .map(([, info]) => info);

    for (const subject of subjects) {
      subject.gauges = vote.gauges;
      subject.weights = vote.weights;
    }

    return state;
  }
}
