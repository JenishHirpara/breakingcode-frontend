import {
  REGISTER_USER,
  USER_ERROR,
  LOGIN_USER,
  GET_USER,
  LOGOUT,
} from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const registerUser = (user) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("https://breakingcode.onrender.com/api/users/register", user, config);

    console.log(res);
    dispatch({
      type: REGISTER_USER,
      payload: res.data,
    });
    setAuthToken(res.data.token);
  } catch (error) {
    dispatch({
      type: USER_ERROR,
      payload: error.response.statusText,
    });
  }
};

export const loginUser = (user) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("https://breakingcode.onrender.com/api/users/login", user, config);

    console.log(res);
    dispatch({
      type: LOGIN_USER,
      payload: res.data,
    });
    setAuthToken(res.data.token);
  } catch (error) {
    dispatch({
      type: USER_ERROR,
      payload: error?.response?.statusText,
    });
  }
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
//Load User
export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
  try {
    const res = await axios.get("https://breakingcode.onrender.com/api/users/");
    console.log(res.data);
    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USER_ERROR,
      payload: "User Not Signed In",
    });
  }
};
