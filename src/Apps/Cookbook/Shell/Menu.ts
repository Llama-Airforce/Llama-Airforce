import type { Menu } from "@/Framework/Monitor/Shell/Menu";

export const menu: Menu = {
  titleRoute: "/",
  items: [
    {
      to: "/colors",
      label: "Colors",
    },
    {
      to: "/socket",
      label: "Socket.IO",
    },
    {
      label: "Components",
      initCollapsed: true,
      children: [
        {
          to: "/components/async-value",
          label: "AsyncValue",
        },
        {
          to: "/components/blockie",
          label: "Blockie",
        },
        {
          to: "/components/breadcrumb",
          label: "Breadcrumb",
        },
        {
          to: "/components/button",
          label: "Button",
        },
        {
          to: "/components/toggle-button",
          label: "ButtonToggle",
        },
        {
          to: "/components/card",
          label: "Card",
        },
        {
          to: "/components/chart-tv",
          label: "Chart (TV)",
        },
        {
          to: "/components/checkbox",
          label: "Checkbox",
        },
        {
          to: "/components/data-table",
          label: "DataTable",
        },
        {
          to: "/components/input-address",
          label: "InputAddress",
        },
        {
          to: "/components/input-text",
          label: "InputText",
        },
        {
          to: "/components/input-number",
          label: "InputNumber",
        },
        {
          to: "/components/legend",
          label: "Legend",
        },
        {
          to: "/components/modal",
          label: "Modal",
        },
        {
          to: "/components/pagination",
          label: "Pagination",
        },
        {
          to: "/components/radio-button",
          label: "RadioButton",
        },
        {
          to: "/components/select",
          label: "Select",
        },
        {
          to: "/components/slider",
          label: "Slider",
        },
        {
          to: "/components/spinner",
          label: "Spinner",
        },
        {
          to: "/components/tabs",
          label: "Tabs",
        },
        {
          to: "/components/tooltip",
          label: "Tooltip",
        },
      ],
    },
    {
      label: "Composables",
      initCollapsed: true,
      children: [
        {
          to: "/composables/use-approve",
          label: "useApprove",
        },
      ],
    },
  ],
};
