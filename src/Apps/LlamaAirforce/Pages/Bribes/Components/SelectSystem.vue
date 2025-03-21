<script setup lang="ts">
import aura from "@/Assets/Icons/Tokens/aura.png";
import crv from "@/Assets/Icons/Tokens/crv.svg";
import fxn from "@/Assets/Icons/Tokens/fxn.svg";
import prisma from "@/Assets/Icons/Tokens/prisma.svg";
import redacted from "@/Assets/Icons/Tokens/redacted.png";
import votium from "@/Assets/Icons/Tokens/votium.png";
import type { Protocol, Platform } from "../Models";
import { useBribesStore } from "../Store";

const { t } = useI18n();

type SelectOption = {
  label: string;
  logo: string;
};

type PlatformInfo = SelectOption & {
  platform: Platform;
};

type ProtocolInfo = SelectOption & {
  protocol: Protocol;
};

const emit = defineEmits<{
  "select-platform": [platform: Platform];
  "select-protocol": [protocol: Protocol];
}>();

const store = useBribesStore();

const platforms = computed((): PlatformInfo[] => [
  { platform: "votium", label: "Votium", logo: votium },
  { platform: "hh", label: "Hidden Hand", logo: redacted },
]);

const platform = computed(
  () =>
    platforms.value.find((p) => p.platform === store.platform) ??
    platforms.value[0]
);

const protocol = computed(
  () =>
    protocols.value.find((p) => p.protocol === store.protocol) ??
    protocols.value[0]
);

const protocols = computed((): ProtocolInfo[] => [
  { protocol: "cvx-crv", label: "Curve", logo: crv },
  { protocol: "cvx-prisma", label: "Prisma", logo: prisma },
  { protocol: "cvx-fxn", label: "f(x) Protocol", logo: fxn },
  { protocol: "aura-bal", label: "Aura", logo: aura },
]);

// Select
const onPlatformSelect = (option: PlatformInfo): void => {
  const { platform } = option;

  emit("select-platform", platform);

  onProtocolSelect(protocols.value[0]);
};

const onProtocolSelect = (option: ProtocolInfo): void => {
  const { protocol } = option;

  emit("select-protocol", protocol);
};
</script>

<template>
  <div class="system-selector">
    <Select
      class="platform"
      :label="t('platform')"
      :options="platforms"
      :selected="platform"
      @select="onPlatformSelect"
    >
      <template #option="{ option }">
        <div class="option">
          <img :src="option.logo" />
          <div class="label">{{ option.label }}</div>
        </div>
      </template>
    </Select>

    <Select
      class="protocol"
      :label="t('protocol')"
      :options="protocols"
      :selected="protocol"
      @select="onProtocolSelect"
    >
      <template #option="{ option }">
        <div class="option">
          <img :src="option.logo" />
          <div class="label">{{ option.label }}</div>
        </div>
      </template>
    </Select>
  </div>
</template>

<style scoped>
.system-selector {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  > .platform {
    grid-row: 1;
    grid-column: 1;
  }

  > .protocol {
    grid-row: 1;
    grid-column: 2;
  }

  .platform,
  .protocol {
    .option {
      display: flex;
      align-items: center;

      font-size: 1.25rem;
      font-weight: 700;

      img {
        width: 20px;
        height: 20px;
        object-fit: scale-down;
      }

      > .label {
        font-size: 0.875rem;
        margin-left: 0.75rem;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
platform: Platform
protocol: Protocol
</i18n>

<i18n lang="yaml" locale="zh">
platform: 平台
protocol: 协议
</i18n>
