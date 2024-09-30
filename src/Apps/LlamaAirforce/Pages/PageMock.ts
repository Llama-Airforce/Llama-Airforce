import { type Page } from "./Page";

// Mock page, for example when the Union page in the git submodule is not loaded.
const mockPage: Page = {
  title: "foo",
  titleRoute: "",
  visible: false,
  planeX: 0,
  menuHeader: "",
  items: [],
  forceShowMenu: false,
};

export const pageUnion = mockPage;
export const pageUnionRoutes = [];
