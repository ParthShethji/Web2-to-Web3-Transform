import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render( <ThirdwebProvider>
    <App />
  </ThirdwebProvider>);
