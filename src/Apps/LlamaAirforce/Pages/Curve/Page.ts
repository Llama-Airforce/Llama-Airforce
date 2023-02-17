import { Page } from "@LAF/Pages/Page";

import CurvePools from "@LAF/Pages/Curve/Pools/Pools.vue";
import CurveGauges from "@LAF/Pages/Curve/Gauges/Gauges.vue";
import CurvePerf from "@LAF/Pages/Curve/Performance/Performance.vue";
import CurveRevenue from "@LAF/Pages/Curve/Revenue/Revenue.vue";
import CurveUtilization from "@LAF/Pages/Curve/Utilization/Utilization.vue";

//import CurveDaoOverview from "@LAF/Pages/Curve/DAO/Overview/Overview.vue";
import CurveDaoProposals from "@LAF/Pages/Curve/DAO/Proposals/Proposals.vue";
import CurveDaoVeFunder from "@LAF/Pages/Curve/DAO/VeFunder/VeFunder.vue";

export const pageCurve: Page = {
  title: "Curve",
  titleRoute: "/curve",
  visible: true,
  planeX: 105,
  routes: [
    { path: "/curve", redirect: { name: "curvepools" } },
    {
      path: "/curve/pools/:pool?",
      name: "curvepools",
      component: CurvePools,
    },
    {
      path: "/curve/performance/:pool?",
      name: "curveperf",
      component: CurvePerf,
    },
    {
      path: "/curve/gauges/:gauge?",
      name: "curvegauges",
      component: CurveGauges,
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
      name: "curvedaoproposals",
      component: CurveDaoProposals,
    },
  ],
  menuHeader: "headers/curve.png",
  menuItems: [
    {
      to: "/curve/pools",
      icon: "fas fa-chart-pie",
      label: "Pools",
    },
    {
      to: "/curve/gauges",
      icon: "fa fa-tachometer-alt",
      label: "Gauges",
    },
    {
      to: "/curve/revenue",
      icon: "fa fa-usd",
      label: "Revenue",
    },
    {
      to: "/curve/performance",
      icon: "fa fa-stopwatch",
      label: "Performance",
    },
    {
      icon: "fas fa-landmark",
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
      to: "/curve/utilization",
      icon: "fas fa-burn",
      label: "Utilization",
    },
  ],
};
