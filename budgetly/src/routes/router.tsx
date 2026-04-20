import { createHashRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import CreatePaymentPage from "../pages/CreatePaymentPage/CreatePaymentPage";
import SuccessPage from "../pages/successpage/SuccessPage";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "create", element: <CreatePaymentPage /> },
        { path: "success", element: <SuccessPage /> },
      ],
    },
  ],
);

export default router;
