import LoginPage from "./LoginPage/LoginPage";
import Header from "../components/Header/Header";
import { Outlet, createBrowserRouter } from "react-router-dom";
import React from "react";
import CenteredSpin from "../components/CenteredSpin/CenteredSpin";

const RegisterPage = React.lazy(() => import("./RegisterPage/RegisterPage"));
const ProfilePage = React.lazy(() => import("./ProfilePage/ProfilePage"));
const CreateRidePage = React.lazy(
  () => import("./CreateRidePage/CreateRidePage"),
);
const ListOfRides = React.lazy(() => import("./ListOfRides/ListOfRides"));
const MyProfilePage = React.lazy(() => import("./ProfilePage/MyProfilePage"));
const RidePage = React.lazy(() => import("./RidePage/RidePage"));
const EditProfilePage = React.lazy(
  () => import("./EditProfilePage/EditProfilePage"),
);

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
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <ListOfRides />
          </React.Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <RegisterPage />
          </React.Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <MyProfilePage />
          </React.Suspense>
        ),
      },
      {
        path: "profile/edit",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <EditProfilePage />
          </React.Suspense>
        ),
      },
      {
        path: "profile/:userId",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <ProfilePage />
          </React.Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <LoginPage />
          </React.Suspense>
        ),
      },
      {
        path: "create-ride",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <CreateRidePage />
          </React.Suspense>
        ),
      },
      {
        path: "rides",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <ListOfRides />
          </React.Suspense>
        ),
      },
      {
        path: "ride/:ride_id",
        element: (
          <React.Suspense fallback={<CenteredSpin />}>
            <RidePage />
          </React.Suspense>
        ),
      },
    ],
  },
]);

export default router;
