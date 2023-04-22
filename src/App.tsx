import { RouterProvider, useNavigate } from "react-router-dom";
import "./App.css";
import router from "./pages/router";
import { useEffect, type ReactElement } from "react";
import ApiClient from "./api/ApiAuthClient";
import useAuthStore from "./store/auth";

function App(): ReactElement {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
