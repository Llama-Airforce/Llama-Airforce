import { Page } from "@/Pages/Page";

import CurveGauges from "@/Pages/Curve/Gauges/Gauges.vue";
import CurvePrices from "@/Pages/Curve/Prices/Prices.vue";
import CurveReserves from "@/Pages/Curve/Reserves/Reserves.vue";
import CurveVolume from "@/Pages/Curve/Volume/Volume.vue";
import CurveRevenue from "@/Pages/Curve/Revenue/Revenue.vue";
import CurveUtilization from "@/Pages/Curve/Utilization/Utilization.vue";

//import CurveDaoOverview from "@/Pages/Curve/DAO/Overview/Overview.vue";
import CurveDaoProposals from "@/Pages/Curve/DAO/Proposals/Proposals.vue";
import CurveDaoVeFunder from "@/Pages/Curve/DAO/VeFunder/VeFunder.vue";

export const pageCurve: Page = {
  title: "Curve",
  titleRoute: "/curve",
  planeX: 105,
  routes: [
    { path: "/curve", redirect: { name: "curvegauges" } },
    {
      path: "/curve/gauges/:gauge?",
      name: "curvegauges",
      component: CurveGauges,
    },
    {
      path: "/curve/prices/:pool?",
      name: "curvecandles",
      component: CurvePrices,
    },
    {
      path: "/curve/reserves/:pool?",
      name: "curvereserves",
      component: CurveReserves,
    },
    {
      path: "/curve/volume/:pool?",
      name: "curvevolume",
      component: CurveVolume,
    },
    {
      path: "/curve/revenue",
      name: "curverevenue",
      component: CurveRevenue,
    },
    { path: "/curve/utilization/", component: CurveUtilization },

    { path: "/curve/vefunder/", redirect: { name: "curvevefunder" } },
    {
      path: "/curve/dao/vefunder/",
      name: "curvevefunder",
      component: CurveDaoVeFunder,
    },
    /*
     * {
     *   path: "/curve/dao/overview/",
     *   name: "curvedaooverview",
     *   component: CurveDaoOverview,
     * },
     */
    {
      path: "/curve/dao/proposals/",
      name: "curvedaoporposals",
      component: CurveDaoProposals,
    },
  ],
  menuHeader: "headers/curve.png",
  menuItems: [
    {
      icon: "fas fa-chart-pie",
      label: "Pools",
      children: [
        {
          to: "/curve/gauges",
          label: "Gauges",
        },
        {
          to: "/curve/prices",
          label: "Prices",
        },
        {
          to: "/curve/reserves",
          label: "Reserves",
        },
        {
          to: "/curve/volume",
          label: "Volume",
        },
      ],
    },
    {
      icon: "fas fa-funnel-dollar",
      label: "DAO",
      children: [
        /*
         * {
         *   to: "/curve/dao/overview",
         *   label: "Overview",
         * },
         */
        {
          to: "/curve/dao/proposals",
          label: "Proposals",
        },
        {
          to: "/curve/dao/vefunder",
          label: "veFunder",
        },
      ],
    },
    {
      to: "/curve/revenue",
      icon: "fa fa-usd",
      label: "Revenue",
    },
    {
      to: "/curve/utilization",
      icon: "fas fa-burn",
      label: "Utilization",
    },
  ],
};
