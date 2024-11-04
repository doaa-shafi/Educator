import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { CategoryProvider } from "./context/CategoryProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QHO02DO3byePzbJj26959Nt4iMfqcb4cjCpwlEuQqUCrPMdaMVqa2BLhx0zgNHVbXIyxEMCq4iqHFlZ6i3VbDk100GIhfxyR6"
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <Elements stripe={stripePromise}>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </Elements>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
