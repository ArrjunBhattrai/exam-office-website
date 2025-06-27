import jwt_decode from "jwt-decode";
import { logout } from "../redux/authSlice";
import { persistor } from "../redux/store";

export const validateToken = (dispatch, token) => {
  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      dispatch(logout());
      persistor.purge();
      window.location.href = "/";
    }
  } catch (error) {
    dispatch(logout());
    persistor.purge();
    window.location.href = "/";
  }
};
