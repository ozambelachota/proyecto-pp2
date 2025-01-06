import { Route } from "react-router";
import LoginPage from "./login";
import RegisterPage from "./registro";

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </>
  );
};
