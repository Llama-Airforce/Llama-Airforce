<script setup lang="ts">
import CrvUsd from "./Tabs/CrvUsd.vue";
import Governance from "./Tabs/Governance.vue";
import Lending from "./Tabs/Lending.vue";

// Tabs
const isMounted = useMounted();
const router = useRouter();
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["lending", "crvusd", "governance"],
  "profile",
  undefined,
  {
    beforeNavigate: () => {
      if (isMounted.value) {
        delete router.currentRoute.value.query.controller;
      }
    },
  }
);

// User
const { address } = useAccount();
const user = useRouteQuery<string>("user", address.value ?? "");
const inputAddressRef = useTemplateRef("inputAddress");
const inputValue = ref(user.value);
let initialized = false;

// Handle user selection from InputAddress
function onNewUser(address: string) {
  user.value = address;
  inputValue.value = address;

  if (inputAddressRef.value) {
    inputAddressRef.value.selected = address;
  }
}

// Sync wallet changes to user after initial load
whenever(address, (address) => {
  if (!initialized && !!user.value) {
    initialized = true;
    return;
  }

  onNewUser(address);
});

watch(user, onNewUser);
</script>

<template>
  <div class="dashboard">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <template #actions>
        <InputAddress
          ref="inputAddress"
          v-model="inputValue"
          @select="onNewUser($event.address)"
        />
      </template>

      <TabItem header="Lending">
        <Lending v-if="tabActive === 'lending'" />
      </TabItem>

      <TabItem header="crvUSD">
        <CrvUsd v-if="tabActive === 'crvusd'" />
      </TabItem>

      <TabItem header="Governance">
        <KeepAlive>
          <Governance v-if="tabActive === 'governance'" />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);
}

.input-address {
  min-width: 64ch;

  @media only screen and (max-width: 1280px) {
    min-width: 48ch;
  }
}
</style>
