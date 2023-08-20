/* eslint-disable max-lines-per-function */
import { test, describe, expect, beforeEach } from "vitest";
import dotenv from "dotenv";
import { JsonRpcProvider } from "@ethersproject/providers";
import { GaugeVotePlatform__factory } from "@/Contracts";
import { GaugeVotePlatformAddress } from "@/Util/Addresses";
import {
  L2VotingService,
  type Vote,
} from "@LAF/Pages/Bribes/Rounds/Services/L2VotingService";

dotenv.config({ path: "./.env" });

describe("Convex L2 Gauge Voting System", () => {
  let votingService: L2VotingService;

  beforeEach(() => {
    const provider = new JsonRpcProvider("https://zkevm-rpc.com");

    const votePlatform = GaugeVotePlatform__factory.connect(
      GaugeVotePlatformAddress,
      provider
    );

    votingService = new L2VotingService(provider, votePlatform);
  });

  describe("proposal", () => {
    test("get proposal", async () => {
      const proposal = await votingService.getProposal(3);

      expect(proposal.baseWeightMerkleRoot).toEqual(
        "0x441ce42ad0b0514c1cdc25be483dbd0a87da3fc38ffa17edcf78a9ba12d891b9"
      );

      expect(proposal.startTime).toEqual(1692230459n);
      expect(proposal.endTime).toEqual(1692662459n);
    });

    test("get base merkle", async () => {
      const proposal = {
        id: 3,
        baseWeightMerkleRoot:
          "0x441ce42ad0b0514c1cdc25be483dbd0a87da3fc38ffa17edcf78a9ba12d891b9",
        startTime: 1692230459n,
        endTime: 1692662459n,
      };

      const baseMerkle = await votingService.getBaseMerkle(proposal);

      expect(baseMerkle.root).toEqual(proposal.baseWeightMerkleRoot);
      expect(baseMerkle.blockHeight).toEqual(17930828);

      const user =
        baseMerkle.users["0x3afb0b4ca9ab60165e207cb14067b07a04114413"];
      expect(user.leaf).toEqual(
        "0x7c9fe2224189fd84706c261003f15a466bd93a00b3db0bebe639ec0601eb826d"
      );
      expect(user.proof[0]).toEqual(
        "0x5be81e2632f5d088d80981611a4c58c0668767af54436c5aa60b580d17c6a47f"
      );
      expect(user.base_amount).toEqual("20018834127427354179336");
      expect(user.adjusted_amount).toEqual("31998674738620124850");
      expect(user.delegate).toEqual(
        "0x3afb0b4ca9ab60165e207cb14067b07a04114413"
      );
    });
  });

  describe("votes", () => {
    test("get voters", async () => {
      const voters = await votingService.getVoters(3);

      expect(voters.length).toEqual(12);
    });

    test("get votes - 1 voter", async () => {
      const voters = ["0xaac0aa431c237c2c0b5f041c8e59b3f1a43ac78f"];
      const votes = await votingService.getVotes(3, voters);

      expect(votes.length).toEqual(1);

      const vote = votes[0];

      expect(vote.voter).toEqual(voters[0]);
      expect(vote.gauges.length).toEqual(6);
      expect(vote.gauges[0]).toEqual(
        "0x903da6213a5a12b61c821598154efad98c3b20e4"
      );
      expect(vote.gauges[1]).toEqual(
        "0x7e1444ba99dcdffe8fbdb42c02f0005d14f13be1"
      );
      expect(vote.gauges[2]).toEqual(
        "0xaa386ef96a910ee2f9cbef7b139e99a88df3b2ba"
      );
      expect(vote.gauges[3]).toEqual(
        "0xab1927160ec7414c6fa71763e2a9f3d107c126dd"
      );
      expect(vote.gauges[4]).toEqual(
        "0xc2075702490f0426e84e00d8b328119027813ac5"
      );
      expect(vote.gauges[5]).toEqual(
        "0x2932a86df44fe8d2a706d8e9c5d51c24883423f5"
      );

      expect(vote.voted).toEqual(true);
      expect(vote.baseWeight).toEqual(4126094597573075953939646n);
      expect(vote.adjustedWeight).toEqual(0n);

      expect(vote.weights.length).toEqual(6);
      expect(vote.weights[0]).toEqual(1670n);
      expect(vote.weights[1]).toEqual(1666n);
      expect(vote.weights[2]).toEqual(1666n);
      expect(vote.weights[3]).toEqual(1666n);
      expect(vote.weights[4]).toEqual(1666n);
      expect(vote.weights[5]).toEqual(1666n);
    });
  });

  describe("state", () => {
    test("base merkle to state", () => {
      const baseMerkle = {
        root: "0x441ce42ad0b0514c1cdc25be483dbd0a87da3fc38ffa17edcf78a9ba12d891b9",
        blockHeight: 17930828,
        users: {
          "0x3ab6122981242edbf693ec6cb0ae5d1eddce15a1": {
            leaf: "0x5be81e2632f5d088d80981611a4c58c0668767af54436c5aa60b580d17c6a47f",
            proof: ["meh"],
            base_amount: "16211601638962950244871",
            adjusted_amount: "0",
            delegate: "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49",
          },
          "0x3afb0b4ca9ab60165e207cb14067b07a04114413": {
            leaf: "0x7c9fe2224189fd84706c261003f15a466bd93a00b3db0bebe639ec0601eb826d",
            proof: ["meh2"],
            base_amount: "20018834127427354179336",
            adjusted_amount: "31998674738620124850",
            delegate: "0x3afb0b4ca9ab60165e207cb14067b07a04114413",
          },
        },
      };

      const state = votingService.baseMerkleToState(baseMerkle);

      const user1 = "0x3ab6122981242edbf693ec6cb0ae5d1eddce15a1";
      expect(state[user1].gauges).toEqual([]);
      expect(state[user1].weights).toEqual([]);
      expect(state[user1].voted).toEqual(false);
      expect(state[user1].score).toEqual(16211601638962950244871n);
      expect(state[user1].delegate).toEqual(
        "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49"
      );

      const user2 = "0x3afb0b4ca9ab60165e207cb14067b07a04114413";
      expect(state[user2].gauges).toEqual([]);
      expect(state[user2].weights).toEqual([]);
      expect(state[user2].voted).toEqual(false);
      expect(state[user2].score).toEqual(20018834127427354179336n);
      expect(state[user2].delegate).toEqual(
        "0x3afb0b4ca9ab60165e207cb14067b07a04114413"
      );
    });

    test("apply vote", () => {
      const baseMerkle = {
        root: "0x441ce42ad0b0514c1cdc25be483dbd0a87da3fc38ffa17edcf78a9ba12d891b9",
        blockHeight: 17930828,
        users: {
          "0xaac0aa431c237c2c0b5f041c8e59b3f1a43ac78f": {
            leaf: "0x1aacd72c414b9d24a2553be1abc662d7bc3770d61e9fbd4fe90e96e14db2510d",
            proof: ["meh"],
            base_amount: "4126094597573075953939646",
            adjusted_amount: "0",
            delegate: "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49",
          },
          "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49": {
            leaf: "0x657aceb7f4f0782d156654b75a37ecd196d042fbbaddb7dbc26a7c1851975fbb",
            proof: ["meh"],
            base_amount: "0",
            adjusted_amount: "23932677399980993803950109",
            delegate: "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49",
          },
        },
      };

      const voteUser: Vote = {
        voter: "0xaac0aa431c237c2c0b5f041c8e59b3f1a43ac78f",
        gauges: ["0x01", "0x02"],
        weights: [1n, 2n],
        voted: true,
        baseWeight: 10n,
        adjustedWeight: 4n,
      };

      const voteDelegate: Vote = {
        voter: "0xde1e6a7ed0ad3f61d531a8a78e83ccddbd6e0c49",
        gauges: ["0x03", "0x04"],
        weights: [5n, 6n],
        voted: true,
        baseWeight: 20n,
        adjustedWeight: 8n,
      };

      // For state 1, we apply vote first, then delegate vote (which should have no effect).
      const state1 = votingService.baseMerkleToState(baseMerkle);
      const user1 = state1["0xaac0aa431c237c2c0b5f041c8e59b3f1a43ac78f"];
      expect(user1.voted).toEqual(false);
      expect(user1.gauges).toEqual([]);
      expect(user1.weights).toEqual([]);
      expect(user1.score).toEqual(4126094597573075953939646n);

      votingService.applyVote(state1, voteUser);
      expect(user1.voted).toEqual(true);
      expect(user1.gauges).toEqual(["0x01", "0x02"]);
      expect(user1.weights).toEqual([1n, 2n]);
      expect(user1.score).toEqual(10n);

      votingService.applyVote(state1, voteDelegate);
      expect(user1.voted).toEqual(true);
      expect(user1.gauges).toEqual(["0x01", "0x02"]);
      expect(user1.weights).toEqual([1n, 2n]);
      expect(user1.score).toEqual(10n);

      // For state 2, we apply delegate vote first before applying user vote.
      const state2 = votingService.baseMerkleToState(baseMerkle);
      const user2 = state2["0xaac0aa431c237c2c0b5f041c8e59b3f1a43ac78f"];
      expect(user2.voted).toEqual(false);
      expect(user2.gauges).toEqual([]);
      expect(user2.weights).toEqual([]);
      expect(user2.score).toEqual(4126094597573075953939646n);

      votingService.applyVote(state2, voteDelegate);
      expect(user2.voted).toEqual(false);
      expect(user2.gauges).toEqual(["0x03", "0x04"]);
      expect(user2.weights).toEqual([5n, 6n]);
      expect(user2.score).toEqual(4126094597573075953939646n);

      votingService.applyVote(state2, voteUser);
      expect(user2.voted).toEqual(true);
      expect(user2.gauges).toEqual(["0x01", "0x02"]);
      expect(user2.weights).toEqual([1n, 2n]);
      expect(user2.score).toEqual(10n);
    });
  });

  describe("integration", () => {
    test("proposal 3", async () => {
      const proposal = await votingService.getProposal(3);
      const baseMerkle = await votingService.getBaseMerkle(proposal);
      const state = votingService.baseMerkleToState(baseMerkle);
      const voters = await votingService.getVoters(proposal.id);
      const votes = await votingService.getVotes(proposal.id, voters);

      for (const vote of votes) {
        votingService.applyVote(state, vote);
      }

      // All users that voted should have their exact vote recorded.
      for (const vote of votes) {
        const info = state[vote.voter];
        expect(info.voted).toEqual(true);
        expect(info.gauges).toEqual(vote.gauges);
        expect(info.weights).toEqual(vote.weights);
        expect(info.score).toEqual(vote.baseWeight);
      }

      // All users with no vote but with delegate should have the vote of their delegate if delegate voted.
      const nonVoters = Object.entries(state).filter(
        ([user, info]) =>
          !info.voted && // User must not have voted themself.
          info.delegate !== user && // No self delegate means there's a delegate.
          votes.map((v) => v.voter).includes(info.delegate) // Delegate must have voted.
      );

      for (const [user, info] of nonVoters) {
        const voteDelegate = votes.find((v) => v.voter === info.delegate)!;
        expect(info.voted).toEqual(false);
        expect(info.gauges).toEqual(voteDelegate.gauges);
        expect(info.weights).toEqual(voteDelegate.weights);
        expect(info.score).toEqual(BigInt(baseMerkle.users[user].base_amount)); // Original score.
      }
    });
  });
});
