import { type Page } from "@/Framework/Monitor/Page";

export const pageMain: Page = {
  titleRoute: "/",
  menuItems: [
    {
      to: "/colors",
      label: "Colors",
    },
    {
      to: "/dashboard",
      label: "Dashboard",
    },
    {
      to: "/socket",
      label: "Socket.IO",
    },
    {
      label: "Framework",
      children: [
        {
          to: "/async-value",
          label: "AsyncValue",
        },
        {
          to: "/breadcrumb",
          label: "Breadcrumb",
        },
        {
          to: "/button",
          label: "Button",
        },
        {
          to: "/button-toggle",
          label: "ButtonToggle",
        },
        {
          to: "/card",
          label: "Card",
        },
        {
          to: "/card-graph",
          label: "CardGraph",
        },
        {
          to: "/data-table",
          label: "DataTable",
        },
        {
          to: "/input-text",
          label: "InputText",
        },
        {
          to: "/input-number",
          label: "InputNumber",
        },
        {
          to: "/modal",
          label: "Modal",
        },
        {
          to: "/pagination",
          label: "Pagination",
        },
        {
          to: "/select",
          label: "Select",
        },
        {
          to: "/slider",
          label: "Slider",
        },
        {
          to: "/spinner",
          label: "Spinner",
        },
        {
          to: "/tabs",
          label: "Tabs",
        },
        {
          to: "/tooltip",
          label: "Tooltip",
        },
      ],
    },
  ],
};
