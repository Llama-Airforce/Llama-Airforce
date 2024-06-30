import { execSync } from "child_process";
import { rmSync, cpSync } from "fs";
import { join } from "path";
import consola from "consola";

const apps = ["cb", "laf", "cm", "pm", "pm-lrt"] as const;

type App = (typeof apps)[number];

type Options = {
  app: App;
  check: boolean;
};

void (async () => {
  // Prompt user for input
  const app = await consola.prompt("Enter the app (cb, laf, cm, pm, pm-lrt):", {
    type: "select",
    options: [...apps],
  });

  // Prompt user for input
  const check = await consola.prompt("Lint & typecheck?", {
    type: "confirm",
    initial: true,
  });

  try {
    deploy({ app, check });
  } catch (error) {
    consola.error(error);
  }
})();

function deploy(opts: Options) {
  const { app, check } = opts;

  if (!apps.includes(app)) {
    throw new Error(`App '${app}' is not a valid app`);
  }

  let dirDist: string;
  let dirOutput: string;

  // eslint-disable-next-line default-case
  switch (app) {
    case "cb":
      dirDist = "src/Apps/Cookbook/dist";
      dirOutput = "Cookbook-Web";
      break;
    case "laf":
      dirDist = "src/Apps/LlamaAirforce/dist";
      dirOutput = "Llama-Airforce-Web";
      break;
    case "cm":
      dirDist = "src/Apps/CurveMonitor/dist";
      dirOutput = "Curve-Monitor-Web";
      break;
    case "pm":
      dirDist = "src/Apps/PrismaMonitor/dist";
      dirOutput = "Prisma-Monitor-Web";
      break;
    case "pm-lrt":
      dirDist = "src/Apps/PrismaMonitor/dist";
      dirOutput = "Prisma-Monitor-Lrt-Web";
      break;
  }

  // Build website
  if (check) {
    execSync(`npm run typecheck`, { stdio: "inherit" });
    execSync(`npm run lint:${app}`, { stdio: "inherit" });
  }
  execSync(`npm run build:${app}`, { stdio: "inherit" });

  // Ensure output directory exists
  const outputPath = join("..", dirOutput);
  const outputPathFull = join(__dirname, outputPath);

  // Clean git directory
  execSync(`git -C ${outputPathFull} rm -rf .`);

  // Copy dist contents to git folder
  const distPathFull = join(__dirname, dirDist);
  cpSync(distPathFull, outputPathFull, { recursive: true });

  // Delete old dist folder
  rmSync(distPathFull, { recursive: true, force: true });

  // Create new commit & push
  execSync(`git -C ${outputPathFull} add --all`);
  execSync(`git -C ${outputPathFull} commit -m "New release"`);
  execSync(`git -C ${outputPathFull} push`);
}
