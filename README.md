<p align="center">
  <img src="public/card.png" width="300" alt="Llama Airforce">
  <p align="center">🦙✈️ Airdropping knowledge bombs and providing air support about the DeFi ecosystem</p>

  <p align="center"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# Llama Airforce
This repository contains the public front-end of the [Llama Airforce](https://llama.airforce) website, excluding the Union page & scripts. The primary goal of this repository is to be open and transparant about our methods, and to give people the opportunity to contribute.

The front-end makes use of the following technologies, frameworks and libraries:
* [TypeScript](https://www.typescriptlang.org/) and [ESLint](https://eslint.org/)
* [Vite](https://vitejs.dev/) and [Vitest](https://vitest.dev/)
* [Vue 3](https://vuejs.org/), [Vue Router](https://router.vuejs.org/) and [Pinia](https://pinia.vuejs.org/)
* [Ethers](https://docs.ethers.io/v5/), [Web3-Onboard](https://docs.blocknative.com/onboard) and [TypeChain](https://github.com/dethcrypto/TypeChain)
* [ApexCharts](https://apexcharts.com/docs/vue-charts/), [TradingView Lightweight Charts](https://www.tradingview.com/lightweight-charts/) and [Vue 3 Popper](https://valgeirb.github.io/vue3-popper/).

## Installation

```bash
npm install
```

## Usage
### NPM Scripts

| Command | Description |
| ------- | ----------- |
| `lint` | Lints the entire codebase using [ESLint](https://eslint.org/). |
| `typecheck ` | Typechecks the project using the Typescript compiler, not emitting files. |
| `dev`  | Starts a local development server. |
| `build` | Builds a website distribution into the `dist` folder. |
| `build contracts` | Builds Typescript contract definitions using [TypeChain](https://github.com/dethcrypto/TypeChain). It reads ABI files from `/src/ABI` and places the contract definition files into `/src/Contracts`. |
| `test` | Runs all unit tests. |
| `union` | Runs the Union airdrop generation script. This is for Llama Airforce devs only, as the Union is behind a private git submodule. |