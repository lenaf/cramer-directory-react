import { home, business, people, grid, person } from "ionicons/icons";
import HomePage from "./components/pages/HomePage";
import PeoplePage from "./components/pages/PeoplePage";
import CompanyPage from "./components/pages/CompanyPage";
import CategoryPage from "./components/pages/CategoryPage";
import ProfilePage from "./components/pages/ProfilePage";

export const ROUTES = [
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
  {
    id: "profile",
    label: "Profile",
    icon: person,
    path: "/profile",
    component: ProfilePage,
  },
];
