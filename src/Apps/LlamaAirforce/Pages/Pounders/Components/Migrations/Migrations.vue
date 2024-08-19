<script setup lang="ts">
import MigrateUBal from "@Pounders/Components/Migrations/MigrateUBal.vue";
import MigrateUCrv from "@Pounders/Components/Migrations/MigrateUCrv.vue";
import MigrateUCrvV2 from "@Pounders/Components/Migrations/MigrateUCrvV2.vue";
import MigrateUFxs from "@Pounders/Components/Migrations/MigrateUFxs.vue";
import MigrateStkCvxPrisma from "@Pounders/Components/Migrations/MigrateStkCvxPrisma.vue";
</script>

<template>
  <MigrateUCrvV2></MigrateUCrvV2>
  <MigrateUCrv></MigrateUCrv>
  <MigrateUBal></MigrateUBal>
  <MigrateUFxs></MigrateUFxs>
  <MigrateStkCvxPrisma></MigrateStkCvxPrisma>
</template>
