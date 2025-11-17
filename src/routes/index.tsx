import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFound from "../components/additionals/NotFound"; 
import { lazy } from "react";

const Builder = lazy(()=> import("../pages/user/Builder"));
const Preview = lazy(()=> import("../pages/user/Preview"));

const routes = createBrowserRouter([
  {
    element:<App />,
    path: "/",
    children: [
      {
        index: true,
        Component: Builder,
      }
    ],
  },
  {
    path : '/preview',
    Component : Preview
  },{
    path : '/404',
    Component : NotFound
  }
]);

export default routes;
