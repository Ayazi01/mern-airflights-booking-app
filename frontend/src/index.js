import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import {ResProvider} from "./components/UseContext"

ReactDOM.render(
  <ResProvider>
    <App />
  </ResProvider>,
  document.getElementById("root")
);
