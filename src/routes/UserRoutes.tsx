import { Route } from "react-router-dom";
import Error from "../pages/error";
import Movies from "../pages/admin/Movies";
import MainLayout from "../layout/MainLayout";

const UserRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route path="movies" element={<Movies />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
