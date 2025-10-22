import { type RouteObject } from "react-router-dom";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ROUTES } from "@/constants";

export const routeConfig: RouteObject[] = [
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: "*",
    element: <DashboardPage />, // Fallback to DashboardPage for unknown routes
  },
];
