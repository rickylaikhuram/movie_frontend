import { Route } from "react-router-dom";
import Error from "../pages/error";
import Movies from "../pages/Movies";
import MainLayout from "../layout/MainLayout";
import MovieDetailsPage from "../pages/MovieDetails";
import AccountLayout from "../components/user/layout/UserProfileLayout";
import AccountDetails from "../pages/user/UserDetails";

const UserRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route path="movies" element={<Movies />} />
    <Route path="movies/:id" element={<MovieDetailsPage />} />
    <Route path="/account" element={<AccountLayout />}>
      <Route index element={<AccountDetails />} />
      <Route path="profile" element={<AccountDetails />} />
    </Route>
    <Route path="*" element={<Error />} />
  </Route>
);

export default UserRoutes;
