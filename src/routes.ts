import { home, business, people, grid } from "ionicons/icons";
import HomePage from "./components/pages/HomePage";
import PeoplePage from "./components/pages/PeoplePage";
import CompanyPage from "./components/pages/CompanyPage";
import CategoryPage from "./components/pages/CategoryPage";

export const NAV_ROUTES = [
  { id: "home", label: "Home", icon: home, path: "/home", component: HomePage },
  {
    id: "people",
    label: "People",
    icon: people,
    path: "/people",
    component: PeoplePage,
  },
  {
    id: "company",
    label: "Companies",
    icon: business,
    path: "/company",
    component: CompanyPage,
  },
  {
    id: "category",
    label: "Categories",
    icon: grid,
    path: "/category",
    component: CategoryPage,
  },
];
