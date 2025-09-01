import { Navigate, Route } from "react-router-dom";
import Error from "../pages/error";
import Movies from "../pages/Movies";
import MainLayout from "../layout/MainLayout";
import MovieDetailsPage from "../pages/MovieDetails";
import AccountLayout from "../components/user/layout/UserProfileLayout";
import AccountDetails from "../pages/user/UserDetails";
import Watchlist from "../pages/user/UserWatchlist";
import Reviews from "../pages/user/UserReview";

const UserRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route path="movies" element={<Movies />} />
    <Route path="movies/:id" element={<MovieDetailsPage />} />
    <Route path="movies/:id" element={<MovieDetailsPage />} />
    <Route path="movies/:id" element={<MovieDetailsPage />} />
    <Route path="/account" element={<AccountLayout />}>
      <Route index element={<AccountDetails />} />
      <Route path="/account/profile" element={<AccountDetails />} />
      <Route path="/account/watchlist" element={<Watchlist />}/>
      <Route path="/account/reviews" element={<Reviews />}/>
    </Route>
    <Route path="*" element={<Error />} />
     <Route path="/signin" element={<Navigate to="/account/profile" replace />} />
  </Route>
);

export default UserRoutes;
