import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Create } from "./screens/Create";
import { CreateScreen } from "./screens/CreateScreen";
import { CreateWrapper } from "./screens/CreateWrapper";
import { DivWrapper } from "./screens/DivWrapper";
import { HomeAll } from "./screens/HomeAll";
import { HomeDetalletoken } from "./screens/HomeDetalletoken";
import { HomeNew } from "./screens/HomeNew";
import { HomeNext } from "./screens/HomeNext";
import { News } from "./screens/News";
import { Publish } from "./screens/Publish";
import { PublishScreen } from "./screens/PublishScreen";
import { PublishWrapper } from "./screens/PublishWrapper";
import { Screen15 } from "./screens/Screen15";
import { SwapScreen } from "./screens/SwapScreen";
import { Vote } from "./screens/Vote";
import { VoteDetalletoken } from "./screens/VoteDetalletoken";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <HomeAll />,
  },
  {
    path: "/homeu47all",
    element: <HomeAll />,
  },
  {
    path: "/news",
    element: <News />,
  },
  {
    path: "/swap",
    element: <SwapScreen />,
  },
  {
    path: "/homeu47next",
    element: <HomeNext />,
  },
  {
    path: "/homeu47new",
    element: <HomeNew />,
  },
  {
    path: "/create5",
    element: <Create />,
  },
  {
    path: "/homeu47detalletokenu47compra",
    element: <HomeDetalletoken />,
  },
  {
    path: "/voteu47detalletokenu47vista",
    element: <VoteDetalletoken />,
  },
  {
    path: "/publish1",
    element: <Publish />,
  },
  {
    path: "/vote",
    element: <Vote />,
  },
  {
    path: "/publish2",
    element: <PublishScreen />,
  },
  {
    path: "/create4",
    element: <CreateScreen />,
  },
  {
    path: "/publish3",
    element: <PublishWrapper />,
  },
  {
    path: "/publish4",
    element: <DivWrapper />,
  },
  {
    path: "/create1",
    element: <CreateWrapper />,
  },
  {
    path: "/create2",
    element: <Screen15 />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
