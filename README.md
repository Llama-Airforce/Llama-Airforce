<p align="center">
  <img src="https://llama.airforce/card.png" width="100" alt="Llama Airforce">
  <p align="center">🦙✈️ Airdropping knowledge bombs and providing air support about the DeFi ecosystem</p>

  <p align="center">
    <a><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
    <a href="https://github.com/Llama-Airforce/Llama-Airforce/actions"><img alt="Build Status" src="https://github.com/Llama-Airforce/Llama-Airforce/actions/workflows/node.js.yml/badge.svg"></a>
  </p>
</p>

# Llama Airforce Monorepo

This repository contains the public front-end of the [Llama Airforce](https://llama.airforce) ecosystem, including multiple applications. The primary goal of this repository is to be open and transparent about our methods, and to give people the opportunity to contribute.

## Applications

This monorepo contains the following applications:

- Llama Airforce (LAF)
- Curve Monitor (CM)
- Prisma Monitor (PM)

## Monorepo Structure

Each application has its own folder under `src/Apps/`, containing its specific components, pages, and logic. The shared `Framework` folder is located at `src/Framework/`.

We use `unplugin-auto-import` and `unplugin-vue-components` to reduce the number of imports needed in the front-end, including those framework components. This approach simplifies development and promotes code reuse across applications.

## Technologies

The front-end makes use of the following technologies, frameworks, and libraries:

- [TypeScript](https://www.typescriptlang.org/) and [ESLint](https://eslint.org/)
- [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
- [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/), and [Pinia](https://pinia.vuejs.org/)
- [Viem](https://viem.sh/) and [@wagmi/vue](https://wagmi.sh/vue/getting-started)
- [ApexCharts](https://apexcharts.com/docs/vue-charts/) and [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/)
- [RxJS](https://rxjs.dev/)

## Quick Start

To get started with any of the applications quickly:

1. Clone the repository:

```bash
git clone https://github.com/Llama-Airforce/Llama-Airforce.git
cd Llama-Airforce
```

2. Install dependencies:

```bash
npm install
```

3. Start a development server (e.g., for Llama Airforce):

```bash
npm run dev:laf
```

4. Open your browser and navigate to `http://localhost:8080`.

## NPM Scripts

| Command          | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `typecheck`      | Typechecks the project using the TypeScript compiler.     |
| `lint:<app>`     | Lints the specified app (laf, cm, pm).                    |
| `dev:<app>`      | Starts a development server for the specified app.        |
| `build:<app>`    | Builds the specified app.                                 |
| `test`           | Runs unit tests for the Llama Airforce app.               |
| `union`          | Runs the Union airdrop generation script (LAF devs only). |
| `union:allocate` | Runs the Union allocation script (LAF devs only).         |
| `union:migrate`  | Runs the Union migration script (LAF devs only).          |
| `deploy`         | Runs the deployment script.                               |

Replace `<app>` with `laf`, `cm`, or `pm` for the respective application.

Note: There's an additional build command for Prisma Monitor: `build:pm-lrt`, which builds a specific version of the Prisma Monitor app.

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory and add necessary variables. Refer to `.env.example` (if available) for required variables.

## Union Functionality

Union functionality is disabled by default, as its source is behind a private git submodule. To enable Union functionality, add `VITE_UNION=true` to your `.env` file.

By doing so, the Union page imported into `main.ts` will no longer be aliased in `vite.config.js` to a mock Union page, and instead will be pointing towards the real implementation. The import in `main.ts` is also shimmed in `shims-vue.d.ts` so that compilation and linting will not fail when the git submodule is empty.

## Contributing

We welcome contributions to the Llama Airforce ecosystem. Please feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the MIT License.
