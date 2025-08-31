import { Route } from "react-router-dom";
import AdminMainLayout from "../layout/AdminMainLayout";
import Error from "../pages/error";
import Movies from "../pages/admin/Movies";

const UserRoutes = (
  <Route path="/" element={<AdminMainLayout />}>
    <Route path="movies" element={<Movies />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
