import { execSync } from "child_process";
import { copySync, removeSync } from "fs-extra";
import { join } from "path";
import consola from "consola";

const apps = ["cb", "laf", "cm", "pm", "pm-lrt"] as const;
const envs = ["prod", "next"] as const;

type App = (typeof apps)[number];
type Env = (typeof envs)[number];

void (async () => {
  // Prompt user for input
  const app = await consola.prompt("Enter the app (cb, laf, cm, pm, pm-lrt):", {
    type: "select",
    options: [...apps],
  });

  const env = await consola.prompt("Enter the environment (prod, next):", {
    type: "select",
    options: [...envs],
  });

  try {
    deploy(app, env);
  } catch (error) {
    consola.error(error);
  }
})();

function deploy(app: App, env: Env) {
  if (!apps.includes(app)) {
    throw new Error(`App '${app}' is not a valid app`);
  }

  if (!envs.includes(env)) {
    throw new Error(`Environment '${env}' is not a valid environment`);
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
      dirOutput =
        env === "prod" ? "Llama-Airforce-Web" : "Llama-Airforce-Web-Next";
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
  execSync(`npm run build:${app}`, { stdio: "inherit" });

  // Ensure output directory exists
  const outputPath = join("..", dirOutput);
  const outputPathFull = join(__dirname, outputPath);

  // Clean git directory
  execSync(`git -C ${outputPathFull} rm -rf .`);

  // Copy dist contents to git folder
  const distPathFull = join(__dirname, dirDist);
  copySync(distPathFull, outputPathFull, { overwrite: true });

  // Delete old dist folder
  removeSync(distPathFull);

  // Create new commit & push
  execSync(`git -C ${outputPathFull} add --all`);
  execSync(`git -C ${outputPathFull} commit -m "New release"`);
  execSync(`git -C ${outputPathFull} push`);
}
