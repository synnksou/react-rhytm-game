import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Scoreboard from "./pages/Scoreboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/scoreboard",
    element: <Scoreboard />,
  },
]);

const theme = extendTheme({
  fonts: {
    heading: `'Press Start 2P', cursive`,
    body: `'Press Start 2P', cursive`,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
