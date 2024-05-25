import { type PageLAF } from "@LAF/Pages/Page";

// Mock page, for example when the Union page in the git submodule is not loaded.
const mockPage: PageLAF = {
  title: "foo",
  titleRoute: "",
  visible: false,
  planeX: 0,
  menuHeader: "",
  menuItems: [],
  forceShowMenu: false,
};

export const pageUnion = mockPage;
export const pageUnionRoutes = [];
