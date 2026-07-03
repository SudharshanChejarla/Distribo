import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Slide } from "react-toastify";
import StartupLoader from "./components/StartupLoader";


ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>

    <StartupLoader>
      <App />
    </StartupLoader>

    <ToastContainer
      transition={Slide}
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
    
  </BrowserRouter>
);