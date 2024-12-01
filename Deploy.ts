import { execSync } from "child_process";
import { rmSync, cpSync, writeFileSync } from "fs";
import { join } from "path";
import consola from "consola";

const apps = ["laf", "cm", "pm", "pm-lrt"] as const;

type App = (typeof apps)[number];

type Options = {
  app: App;
  check: boolean;
};

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

function deploy(opts: Options) {
  const { app, check } = opts;

  if (!apps.includes(app)) {
    throw new Error(`App '${app}' is not a valid app`);
  }

  let dirApp: string;
  let dirOutput: string;

  switch (app) {
    case "laf":
      dirApp = "src/Apps/LlamaAirforce";
      dirOutput = "Llama-Airforce-Web";
      break;
    case "cm":
      dirApp = "src/Apps/CurveMonitor";
      dirOutput = "Curve-Monitor-Web";
      break;
    case "pm":
      dirApp = "src/Apps/PrismaMonitor";
      dirOutput = "Prisma-Monitor-Web";
      break;
    case "pm-lrt":
      dirApp = "src/Apps/PrismaMonitor";
      dirOutput = "Prisma-Monitor-Lrt-Web";
      break;
  }

  // Build website
  if (check) {
    execSync(`bun run typecheck`, { stdio: "inherit" });
    execSync(`bun run lint`, { cwd: dirApp, stdio: "inherit" });
  }
  execSync(`bun run build`, { cwd: dirApp, stdio: "inherit" });

  // Ensure output directory exists
  const outputPath = join("..", dirOutput);
  const outputPathFull = join(__dirname, outputPath);

  // Clean git directory
  execSync(`git -C ${outputPathFull} rm -rf .`);

  // Copy dist contents to git folder
  const dirDist = `${dirApp}/dist`;
  const distPathFull = join(__dirname, dirDist);
  cpSync(distPathFull, outputPathFull, { recursive: true });

  // Create _redirects file specifically for Cloudflare Pages and createWebHistory().
  const redirectsContent = "/* /index.html 200";
  const redirectsPath = join(outputPathFull, "_redirects");
  writeFileSync(redirectsPath, redirectsContent);

  // Delete old dist folder
  rmSync(distPathFull, { recursive: true, force: true });

  // Create new commit & push
  execSync(`git -C ${outputPathFull} add --all`);
  execSync(`git -C ${outputPathFull} commit -m "New release"`);
  execSync(`git -C ${outputPathFull} push`);
}
