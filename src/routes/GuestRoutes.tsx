import { Route } from "react-router-dom";
import Error from "../pages/error";
import Movies from "../pages/admin/Movies";
import SignUp  from "../pages/auth/SignUp";
import MainLayout from "../layout/MainLayout";
import SignIn from "../pages/auth/SignIn";

const GuestRoutes =  (
  <Route path="/" element={<MainLayout />}>
    <Route path="signup" element={<SignUp />} />
    <Route path="signin" element={<SignIn/>} />
    <Route path="movies" element={<Movies />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default GuestRoutes;