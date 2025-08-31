import { Route } from "react-router-dom";
import AdminMainLayout from "../layout/AdminMainLayout";
import Movies from "../pages/admin/Movies";
import Error from "../pages/error";

const AdminRoutes = (
  <Route element={<AdminMainLayout />}>
    <Route path="/movies" element={<Movies />} />
    <Route path="*" element={<Error />} />
  </Route>
);

export default AdminRoutes;
