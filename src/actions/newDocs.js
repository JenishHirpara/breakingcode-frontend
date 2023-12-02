import { FETCH_ALL_DOCS, CREATE_NEW_DOC, FILTER_DOCS, CLEAR_DOCS } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export const fetchAllDocs = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
  try {
    const response = await axios.get("https://breakingcode.onrender.com/api/newdocs/getall/");
    dispatch({ type: FETCH_ALL_DOCS, payload: response.data });
  } catch (error) {
    console.log("User not authenticated");
  }
};

export const filterDocs = text => {
  return ({ type: FILTER_DOCS, payload: text });
}

export const clearFilterDocs = () => {
  return ({ type: CLEAR_DOCS });
}

export const addNewDoc = (title, content, imageUrl, url) => async (dispatch) => {
  console.log(url, 'LALLALALLALA')
  const token = localStorage.getItem("token");
  if (token) {
    setAuthToken(token);
  }
  const data = {
    title: title,
    doc: content,
    imageUrl: imageUrl,
    url
  };
  try {
    const response = await axios.post("https://breakingcode.onrender.com/api/newdocs", data);
    console.log(response.data);
    dispatch({ type: CREATE_NEW_DOC, payload: response.data });
  } catch (error) {
    console.log("Something went wrong...");
  }
};
