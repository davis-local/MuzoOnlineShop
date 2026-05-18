import type { ComponentType } from "react";
import { Category, HomeTrendUp, ShoppingBag } from "iconsax-reactjs";
import type { DashboardSection } from "../types";

export interface DashboardNavigationItem {
  id: DashboardSection;
  title: string;
  caption: string;
  Icon: ComponentType<any>;
}

export const dashboardNavigation: DashboardNavigationItem[] = [
  {
    id: "overview",
    title: "dashboard",
    caption: "Overview and stats",
    Icon: HomeTrendUp,
  },
  {
    id: "products",
    title: "product-list",
    caption: "Products and inventory",
    Icon: ShoppingBag,
  },
  {
    id: "categories",
    title: "categories",
    caption: "Simple category management",
    Icon: Category,
  },
];
