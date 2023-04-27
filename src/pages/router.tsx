import LandingPage from "./HomePage/HomePage";
import RegisterPage from "./RegisterPage/RegisterPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import LoginPage from "./LoginPage/LoginPage";
import Header from "../components/Header/Header";
import { Outlet, createBrowserRouter } from "react-router-dom";
import CreateRidePage from "./CreateRidePage/CreateRidePage";
import ListOfRides from "./ListOfRides/ListOfRides";
import MyProfilePage from "./ProfilePage/MyProfilePage";
import RidePage from "./RidePage/RidePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header /> <Outlet />
      </>
    ),
    children: [
      {
        path: "",
        element: <ListOfRides />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "profile",
        element: <MyProfilePage />,
      },
      {
        path: "profile/:userId",
        element: <ProfilePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "create-ride",
        element: <CreateRidePage />,
      },
      {
        path: "rides",
        element: <ListOfRides />,
      },
      {
        path: "ride/:ride_id",
        element: <RidePage />,
      },
    ],
  },
]);

export default router;
