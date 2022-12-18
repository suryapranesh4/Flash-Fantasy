import {
  config,
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  USER_LOAD,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./types";

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

//Base URL - Backend
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://flash-fantasy-api.onrender.com"
    : "http://localhost:5000";
axios.defaults.baseURL = baseURL;

//Load an user
export const loadUser = () => async (dispatch) => {
  dispatch({ type: USER_LOAD });
  if (localStorage.getItem("token")) {
    setAuthToken(localStorage.getItem("token"));
  }

  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Sign up an user
export const signup = (username, squadname, password) => async (dispatch) => {
  dispatch({ type: SIGNUP });
  const body = JSON.stringify({ username, squadname, password });

  try {
    var res = await axios.post("/api/users", body, config);

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data,
    });

    //To load user once register is successfull
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: err,
    });
  }
};

//Log in an user
export const login = (username, password) => async (dispatch) => {
  dispatch({ type: LOGIN });
  const body = JSON.stringify({ username, password });

  try {
    var res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    //To load user once login is successfull
    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err,
    });
  }
};

//Log out an user
export const logout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
