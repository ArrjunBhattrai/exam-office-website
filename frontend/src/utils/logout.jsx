import { logout } from "../redux/authSlice";
import { persistor } from "../redux/store";

export const logoutUser = (dispatch) => {
  dispatch(logout());

  persistor.purge();
  window.location.href = "/";
};
