import dotenv from "dotenv";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { GaugeVotePlatform__factory } from "@/Contracts";
import { GaugeVotePlatformAddress } from "@/Util/Addresses";
import { L2VotingService } from "@LAF/Pages/Bribes/Rounds/Services/L2VotingService";
import { taskToTE } from "@/Jobs/Bribes/fp";
import { updateBribes } from "@/Jobs/Bribes/Bribes";
import { getEpochs } from "@/Jobs/Bribes/Votium";
import { getGauges } from "@/Jobs/Bribes/Curve";

dotenv.config({ path: "./.env" });

const providerZKEVM = new JsonRpcProvider("https://zkevm-rpc.com");

const votePlatform = GaugeVotePlatform__factory.connect(
  GaugeVotePlatformAddress,
  providerZKEVM
);

const votingService = new L2VotingService(providerZKEVM, votePlatform);

const providerETH = new ethers.providers.AlchemyProvider(
  "homestead",
  process.env.ALCHEMY_KEY
);

const options = {
  provider: providerETH,
  votingService,
  getEpochs: () => taskToTE(() => getEpochs()),
  getGauges: () => taskToTE(() => getGauges()),
};

void (async () => {
  await updateBribes(options);
})();
